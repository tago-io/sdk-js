import * as Papa from "papaparse";

import TagoIOModule from "../../common/TagoIOModule.ts";
import type { LanguageData } from "../Resources/dictionaries.types.ts";
import type {
  IApplyToStringOptions,
  IDictionaryModuleParams,
  IDictionaryModuleParamsAnonymous,
  IParsedExpression,
  IResolveExpressionParams,
} from "./dictionary.types.ts";

// Constants for better maintainability
const CACHE_TTL = 3600000; // 1 hour in milliseconds
const MAX_PARAM_INDEX = 100; // Maximum parameter index to prevent abuse
const EXPRESSION_DELIMITER = "#";
const DICTIONARY_KEY_SEPARATOR = ".";
const PARAM_SEPARATOR = ",";

// Regex patterns compiled once for performance
const DICTIONARY_NAME_PATTERN = /[A-Z0-9_]/;
const KEY_NAME_PATTERN = /[A-Z0-9_,]/;
const EXPRESSION_PATTERN = /^#([A-Z0-9]+)\.([A-Z0-9_]+(?:,.*)?)#$/;

/**
 * Multi-language support for TagoIO applications
 *
 * This class provides internationalization (i18n) functionality for TagoIO applications,
 * allowing you to manage translations and apply language-specific content dynamically.
 * Supports expression parsing, language switching, and translation management.
 *
 * @example Basic dictionary usage
 * ```ts
 * import { Dictionary } from "@tago-io/sdk";
 *
 * const dictionary = new Dictionary({
 *   token: "your-token",
 *   language: "en"
 * });
 *
 * // Apply translations to a string
 * const translated = await dictionary.applyToString(
 *   "Welcome #DICT.GREETING#!",
 *   { language: "pt" }
 * );
 * ```
 *
 * @example Expression parsing
 * ```ts
 * // Parse translation expressions
 * const expressions = dictionary.getExpressionsFromString("#DICT.HELLO# #DICT.WORLD#");
 *
 * // Resolve specific expression
 * const value = await dictionary.resolveExpression({
 *   expression: { scope: "DICT", key: "HELLO" },
 *   language: "es"
 * });
 * ```
 */
class Dictionary extends TagoIOModule<IDictionaryModuleParams> {
  public language: string;
  public runURL?: string;

  constructor(params: IDictionaryModuleParams);
  constructor(params: IDictionaryModuleParamsAnonymous);
  constructor(params: any) {
    super({ token: params?.token || "unknown", region: params?.region });
    this.language = params?.language || "en-US";
    this.runURL = params?.runURL;
  }

  /**
   * Get the language data for a dictionary.
   *
   * @param dictionary ID or Slug of the dictionary
   * @param language Language code (defaults to instance language)
   * @returns Language data or null if not found
   * @throws Error if parameters are missing
   */
  public async getLanguagesData(dictionary: string, language: string = this.language): Promise<LanguageData | null> {
    if (!dictionary?.trim()) {
      throw new Error("Dictionary parameter is required");
    }
    if (!language?.trim()) {
      throw new Error("Language parameter is required");
    }

    try {
      const requestConfig = {
        path: this.runURL
          ? `/dictionary/${this.runURL}/${dictionary}/${language}`
          : `/dictionary/${dictionary}/${language}`,
        method: "GET" as const,
        cacheTTL: CACHE_TTL,
        ...(this.runURL ? {} : { params: { fallback: true } }),
      };

      return this.runURL
        ? await TagoIOModule.doRequestAnonymous<LanguageData>(requestConfig, this.params.region)
        : await this.doRequest<LanguageData>(requestConfig);
    } catch (_e) {
      return null;
    }
  }

  /**
   * Get value from a key in a specific dictionary for a language.
   *
   * @param language Name of the language (locale code)
   * @param dictionary Name of the dictionary
   * @param key Name of the key
   * @returns The translated value or the expression if not found
   * @throws Error if parameters are missing
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const value = await dictionary.getValueFromKey("en-US", "TEST", "OK_BUTTON_LABEL");
   * ```
   */
  public async getValueFromKey(language: string, dictionary: string, key: string): Promise<string> {
    if (!language?.trim()) {
      throw new Error("Language parameter is required");
    }
    if (!dictionary?.trim()) {
      throw new Error("Dictionary parameter is required");
    }
    if (!key?.trim()) {
      throw new Error("Key parameter is required");
    }

    const languagesData = await this.getLanguagesData(dictionary, language);

    // Return expression as is if the request fails or key doesn't exist
    if (!languagesData || !(key in languagesData)) {
      return `${EXPRESSION_DELIMITER}${dictionary}${DICTIONARY_KEY_SEPARATOR}${key}${EXPRESSION_DELIMITER}`;
    }

    return languagesData[key];
  }

  /**
   * Safely extract a dictionary expression from a string, handling quoted parameters with hashtags.
   * @private
   */
  private extractExpression(text: string, startIndex: number): string | null {
    if (!text.startsWith(EXPRESSION_DELIMITER, startIndex)) {
      return null;
    }

    let i = startIndex + 1;
    let inQuotes = false;
    let foundDot = false;

    // Find dictionary.key part
    while (i < text.length) {
      const char = text[i];
      if (char === DICTIONARY_KEY_SEPARATOR) {
        foundDot = true;
      } else if (char === PARAM_SEPARATOR && foundDot) {
        break; // Start of parameters
      } else if (char === EXPRESSION_DELIMITER && !inQuotes && foundDot) {
        // End of expression without parameters
        return text.substring(startIndex, i + 1);
      } else if (!foundDot && !DICTIONARY_NAME_PATTERN.test(char)) {
        return null; // Invalid dictionary name
      } else if (foundDot && !KEY_NAME_PATTERN.test(char)) {
        return null; // Invalid key name (before parameters)
      }
      i++;
    }

    if (!foundDot) {
      return null;
    }

    // Parse parameters if present
    while (i < text.length) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === EXPRESSION_DELIMITER && !inQuotes) {
        return text.substring(startIndex, i + 1);
      }
      i++;
    }

    return null; // No closing delimiter
  }

  /**
   * Parse an expression and extract the names of the dictionary, the key, and
   * any arguments that are passed in the expression.
   *
   * Returns `null` if the value passed is not parseable
   *
   * @param expression String expression
   * @returns Parsed expression or null if invalid
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const value = dictionary.parseExpression("#TAGORUN.WELCOME_TEXT,Hello");
   * ```
   */
  public parseExpression(expression: string): IParsedExpression | null {
    const extractedExpression = this.extractExpression(expression, 0);
    if (!extractedExpression || extractedExpression !== expression) {
      return null;
    }

    const match = expression.match(EXPRESSION_PATTERN);
    if (!match) {
      return null;
    }

    const dictionary = match[1];
    const keyWithParams = match[2];

    if (expression.includes(PARAM_SEPARATOR)) {
      const { data } = Papa.parse<string[]>(keyWithParams);
      if (!data?.[0]) {
        return null;
      }
      const [key, ...params] = data[0];
      return { dictionary, key, params };
    }

    return { dictionary, key: keyWithParams };
  }

  /**
   * Resolve an expression in a language, replacing the parameters in the
   * dictionary value with the arguments passed in the expression.
   *
   * @param resolveParams Object with the language and the parsed expression
   * @returns Resolved string with parameters replaced
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const value = await dictionary.resolveExpression({
   *   language: "en-US",
   *   expression: {
   *     dictionary: "TEST",
   *     key: "SOME_KEY",
   *     params: ["first parameter"],
   *   },
   * });
   * ```
   */
  public async resolveExpression(resolveParams: IResolveExpressionParams): Promise<string> {
    const { language, expression } = resolveParams;
    const { dictionary, key, params } = expression;

    // Get the dictionary value string for the expression
    let resolvedString = await this.getValueFromKey(language, dictionary, key);

    // Replace parameters if they exist
    if (params && params.length > 0) {
      params.forEach((substitution, index) => {
        // Safely escape the index and limit to reasonable range to prevent ReDoS
        if (index >= 0 && index < MAX_PARAM_INDEX) {
          const escapedIndex = String(index).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const subRegexp = new RegExp(`\\$${escapedIndex}`, "g");
          resolvedString = resolvedString.replace(subRegexp, substitution);
        }
      });
    }

    return resolvedString;
  }

  /**
   * Get all (and only) the expressions in a string and their parameters if applicable,
   * ignoring normal words and phrases.
   *
   * @param rawString String with words and/or expressions
   * @returns Array of parsed expressions found in the string
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const expressions = await dictionary.getExpressionsFromString("Words are ignored #TEST.DICT_KEY#");
   * ```
   */
  public async getExpressionsFromString(rawString: string): Promise<IParsedExpression[]> {
    const expressions: IParsedExpression[] = [];
    let i = 0;

    while (i < rawString.length) {
      const hashIndex = rawString.indexOf(EXPRESSION_DELIMITER, i);
      if (hashIndex === -1) {
        break;
      }

      const expression = this.extractExpression(rawString, hashIndex);
      if (expression) {
        const parsed = this.parseExpression(expression);
        if (parsed) {
          expressions.push(parsed);
        }
        i = hashIndex + expression.length;
      } else {
        i = hashIndex + 1;
      }
    }

    return expressions;
  }

  /**
   * Apply the dictionary over a string, parsing the expressions in the string and
   * replacing them with the values found for the respective keys inside the dictionary
   * for a language.
   *
   * Always returns a string. Return the translated string if there are dictionary expressions,
   * the raw string with no changes if there are no expressions, and an empty string if `rawString`
   * is undefined.
   *
   * @param rawString String with words and/or expressions
   * @param _options Object containing options for the dictionary
   * @returns Translated string with all expressions replaced
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const result = await dictionary.applyToString("Words are ignored #TEST.DICT_KEY#");
   * ```
   */
  public async applyToString(rawString: string, _options?: IApplyToStringOptions): Promise<string> {
    const { language } = this;

    // Validate inputs
    if (!rawString || !language) {
      return rawString || "";
    }

    // Early return for non-string values or strings without expressions
    if (typeof rawString !== "string" || !rawString.includes(EXPRESSION_DELIMITER)) {
      return rawString;
    }

    let result = rawString;
    let i = 0;

    while (i < result.length) {
      const hashIndex = result.indexOf(EXPRESSION_DELIMITER, i);
      if (hashIndex === -1) {
        break;
      }

      const expression = this.extractExpression(result, hashIndex);
      if (expression) {
        const parsed = this.parseExpression(expression);
        if (parsed) {
          const { dictionary, key, params } = parsed;
          const replacement = params
            ? await this.resolveExpression({ language, expression: parsed })
            : await this.getValueFromKey(language, dictionary, key);

          result = result.substring(0, hashIndex) + replacement + result.substring(hashIndex + expression.length);
          i = hashIndex + replacement.length;
        } else {
          i = hashIndex + 1;
        }
      } else {
        i = hashIndex + 1;
      }
    }

    return result;
  }
}

export default Dictionary;
