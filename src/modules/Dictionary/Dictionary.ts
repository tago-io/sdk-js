import * as Papa from "papaparse";

import TagoIOModule from "../../common/TagoIOModule";
import {
  IDictionaryModuleParams,
  IParsedExpression,
  IResolveExpressionParams,
  IApplyToStringOptions,
  IDictionaryJSON,
} from "./dictionary.types";

// TODO Remove temporary static dictionaries
import * as enUS from "./en-US.json";
import * as ptBR from "./pt-BR.json";

// Regular expressions that are used for parsing the strings:
// - SPLIT is used to split the string into normal words/phrases and expressions
// - MATCH is used to extract the parts that compose an expression
const RE_SPLIT_EXPRESSION = /(#[A-Z0-9]+\.[A-Z_]+(?:,(?:[^,#"]+|\"[^\"]+\")+)*#)/;
const RE_MATCH_EXPRESSION = /#([A-Z0-9]+)\.([A-Z_]+(?:,(?:[^,#"]+|\"[^\"]+\")+)*)#/;

class Dictionary extends TagoIOModule<IDictionaryModuleParams> {
  constructor(params?: IDictionaryModuleParams) {
    super(params || { token: "unknown" });
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
   * const dictionary = new Dictionary({ token: "my-token" });
   * const value = dictionary.getValueFromKey("en-US", "TEST", "OK_BUTTON_LABEL");
   * ```
   */
  public async getValueFromKey(language: string, dictionary: string, key: string): Promise<string> {
    // TODO Handle localStorage, fetching JSON, checking JSON cache, etc
    if (!language || !dictionary || !key) {
      throw new Error("Missing parameters");
    }

    // TODO Replace this mock language switching
    // TODO Handle language fallback for "en" over "en-US", etc
    const json = language === "pt-BR" ? ptBR : (enUS as IDictionaryJSON);

    // Return expression as is if either dictionary or key do not exist
    if (!json[dictionary] || !json[dictionary][key]) {
      return `#${dictionary}.${key}#`;
    }

    return json[dictionary][key];
  }

  /**
   * Parse an expression and extract the names of the dictionary, the key, and
   * any arguments that are passed in the expression.
   *
   * @param expression String expression.
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ token: "my-token" });
   * const value = dictionary.parseExpression("#TAGORUN.WELCOME_TEXT,Hello");
   * ```
   */
  public parseExpression(expression: string): IParsedExpression {
    const splitExpression = expression.match(RE_MATCH_EXPRESSION);
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
   * const dictionary = new Dictionary({ token: "my-token" });
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
   * const dictionary = new Dictionary({ token: "my-token" });
   * const expressions = dictionary.getExpressionsFromString("Words are ignored #TEST.DICT_KEY#");
   * ```
   */
  public async getExpressionsFromString(rawString: string): Promise<IParsedExpression[]> {
    const tokens = rawString.split(RE_SPLIT_EXPRESSION);

    const expressions = tokens
      .filter((token) => token.startsWith("#") && token.endsWith("#"))
      .map((expression) => this.parseExpression(expression));

    return expressions;
  }

  /**
   * Apply the dictionary over a string, parsing the expressions in the string and
   * replacing them with the values found for the respective keys inside the dictionary
   * for a language.
   *
   * @param rawString String with words and/or expressions.
   * @param options Object containing options for the dictionary, including the language.
   *
   * @example
   * ```
   * const dictionary = new Dictionary({ token: "my-token" });
   * const result = dictionary.applyToString(
   *   "Words are ignored #TEST.DICT_KEY#",
   *   {
   *     language: "en-US",
   *   },
   * );
   * ```
   */
  public async applyToString(rawString: string, options?: IApplyToStringOptions): Promise<string> {
    const { language } = options || {};

    // TODO Possibly handle fallback differently if language is not passed
    // TODO Throw an error if the string is undefined?
    if (!rawString || !language) {
      return rawString || "";
    }

    // Bail early if there are no variables in the string
    if (!rawString.includes("#")) {
      return rawString;
    }

    const tokenized = rawString.split(RE_SPLIT_EXPRESSION);

    const substitutedPromises = tokenized.map((token) => {
      const isExpression = token.startsWith("#") && token.endsWith("#");
      if (isExpression) {
        const expression = this.parseExpression(token);
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
