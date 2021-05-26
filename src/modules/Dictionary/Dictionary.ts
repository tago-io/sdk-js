import * as Papa from "papaparse";

import TagoIOModule from "../../common/TagoIOModule";
import {
  IDictionaryModuleParams,
  IParsedExpression,
  IResolveExpressionParams,
  IApplyToStringOptions,
  IDictionaryModuleParamsAnonymous,
} from "./dictionary.types";
import { LanguageData } from "../Account/dictionaries.types";

// Regular expressions that are used for parsing the strings:
// - SPLIT is used to split the string into normal words/phrases and expressions
// - MATCH is used to extract the parts that compose an expression
const RE_SPLIT_EXPRESSION = /(#[A-Z0-9]+\.[A-Z0-9_]+(?:,(?:[^,#"]+|\"[^\"]+\")+)*#)/;
const RE_MATCH_EXPRESSION = /#([A-Z0-9]+)\.([A-Z0-9_]+(?:,(?:[^,#"]+|\"[^\"]+\")+)*)#/;

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
   * @param language Language.
   * @param dictionary ID or Slug.
   * @param runURL URL for the Run to make anonymous request.
   */
  public async getLanguagesData(dictionary: string, language = this.language): Promise<LanguageData> {
    if (!language || !dictionary) {
      throw new Error("Missing parameters");
    }

    try {
      if (!this.runURL) {
        const response = await this.doRequest<LanguageData>({
          path: `/dictionary/${dictionary}/${language}`,
          method: "GET",
          cacheTTL: 3600000,
          params: {
            fallback: true,
          },
        });
        return response;
      } else {
        const response = await TagoIOModule.doRequestAnonymous<LanguageData>({
          path: `/dictionary/${this.runURL}/${dictionary}/${language}`,
          method: "GET",
          cacheTTL: 3600000,
        });
        return response;
      }
    } catch (e) {
      return null;
    }
  }

  /**
   * Get value from a key in a specific dictionary for a language.
   *
   * @param language Name of the language (locale code).
   * @param dictionary Name of the dictionary.
   * @param key Name of the key.
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const value = dictionary.getValueFromKey("en-US", "TEST", "OK_BUTTON_LABEL");
   * ```
   */
  public async getValueFromKey(language: string, dictionary: string, key: string): Promise<string> {
    if (!language || !dictionary || !key) {
      throw new Error("Missing parameters");
    }

    // Get the dictionary language data from the profile route or anonymous route (Run)
    const languagesData = await this.getLanguagesData(dictionary, language);

    // Return expression as is if the request fails or either dictionary/key do not exist
    if (!languagesData || !languagesData[key]) {
      return `#${dictionary}.${key}#`;
    }

    return languagesData[key];
  }

  /**
   * Parse an expression and extract the names of the dictionary, the key, and
   * any arguments that are passed in the expression.
   *
   * Returns `null` if the value passed is not parseable by the RegEx.
   *
   * @param expression String expression.
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const value = dictionary.parseExpression("#TAGORUN.WELCOME_TEXT,Hello");
   * ```
   */
  public parseExpression(expression: string): IParsedExpression {
    const splitExpression = expression.match(RE_MATCH_EXPRESSION);
    if (!splitExpression) {
      return null;
    }

    const dictionary = splitExpression[1];
    const keyWithParams = splitExpression[2];

    if (expression.includes(",")) {
      const { data } = Papa.parse<string[]>(keyWithParams);
      const [key, ...params] = data[0];

      return { dictionary, key, params };
    }

    return { dictionary, key: keyWithParams };
  }

  /**
   * Resolve an expression in a language, replacing the parameters in the
   * dictionary value with the arguments passed in the expression.
   *
   * @param resolveParams Object with the language and the parsed expression (from `parseExpression`).
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const value = dictionary.resolveExpression({
   *   language: "en-US",
   *   expression: {
   *     dictionary: "TEST",
   *     key: "SOME_KEY",
   *     params: [
   *       "first parameter",
   *     ],
   *   },
   * });
   * ```
   */
  public async resolveExpression(resolveParams: IResolveExpressionParams): Promise<string> {
    const { language, expression } = resolveParams;
    const { dictionary, key, params } = expression;
    let resolvedString: string;

    // Get the dictionary value string for the expression to substitute the arguments into it
    resolvedString = await this.getValueFromKey(language, dictionary, key);
    params.forEach((substitution, index) => {
      const subRegexp = new RegExp(`\\$${index}`, "g");
      resolvedString = resolvedString.replace(subRegexp, substitution);
    });

    return resolvedString;
  }

  /**
   * Get all (and only) the expressions in a string and their parameters if applicable,
   * ignoring normal words and phrases.
   *
   * @param rawString String with words and/or expressions.
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const expressions = dictionary.getExpressionsFromString("Words are ignored #TEST.DICT_KEY#");
   * ```
   */
  public async getExpressionsFromString(rawString: string): Promise<IParsedExpression[]> {
    const tokens = rawString.split(RE_SPLIT_EXPRESSION);

    const expressions = tokens
      .filter((token) => RE_SPLIT_EXPRESSION.test(token))
      .map((expression) => this.parseExpression(expression));

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
   * @param rawString String with words and/or expressions.
   * @param options Object containing options for the dictionary, including the language.
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ language: "en-US", token: "my-token" });
   * const result = dictionary.applyToString("Words are ignored #TEST.DICT_KEY#");
   * ```
   */
  public async applyToString(rawString: string, options?: IApplyToStringOptions): Promise<string> {
    const { language } = this;

    // Handling undefined strings is not this function's job
    if (!rawString || !language) {
      return rawString || "";
    }

    // Bail early if there are no variables in the string or if the value passed
    // is not a string, which can happen when not using TypeScript or passing the
    // instance to a function without the type
    if (typeof rawString !== "string" || !rawString.includes("#")) {
      return rawString;
    }

    const tokenized = rawString.split(RE_SPLIT_EXPRESSION);

    const substitutedPromises = tokenized.map((token) => {
      const isExpression = token.startsWith("#") && token.endsWith("#");
      if (isExpression) {
        const expression = this.parseExpression(token);
        if (!expression) {
          return token;
        }

        const { dictionary, key, params } = expression;

        return params
          ? this.resolveExpression({ language, expression })
          : this.getValueFromKey(language, dictionary, key);
      } else {
        return token;
      }
    });

    let resultString: string;
    await Promise.all(substitutedPromises).then((resolvedValues) => {
      resultString = resolvedValues.join("");
    });

    return resultString;
  }
}

export default Dictionary;
