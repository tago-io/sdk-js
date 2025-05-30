import { Dictionary } from "../../src/modules";

import { enUS, ptBR } from "./__mocks__/dictionaries";

describe("applyToString", () => {
  let dictionary: Dictionary;
  let options: any;
  let fn: jest.SpyInstance;

  beforeAll(() => {
    dictionary = new Dictionary({ token: "mockToken" });
    options = { language: "en-US" };

    // Mock the function that gets data from the API
    fn = jest.spyOn(dictionary, "getLanguagesData").mockImplementation(async (slug, language) => {
      return language === "pt-BR" ? ptBR[slug] : enUS[slug];
    });
  });

  it("does not run if the string is undefined", async () => {
    const valueUndefined = await dictionary.applyToString(undefined, options);
    const valueNull = await dictionary.applyToString(null, options);
    const noLanguage = await dictionary.applyToString("Some string", undefined);

    expect(valueUndefined).toStrictEqual("");
    expect(valueNull).toStrictEqual("");
    expect(noLanguage).toEqual("Some string");
  });

  it("does not apply if the value passed is not a string", async () => {
    const valueObject = await dictionary.applyToString({} as any, options);
    const valueNumber = await dictionary.applyToString(123 as any, options);
    const valueEmptyArray = await dictionary.applyToString([] as any, options);
    const valueArray = await dictionary.applyToString([1, 2, 3] as any, options);
    const valueBoolean = await dictionary.applyToString(true as any, options);

    expect(valueObject).toStrictEqual({});
    expect(valueNumber).toStrictEqual(123);
    expect(valueEmptyArray).toStrictEqual([]);
    expect(valueArray).toStrictEqual([1, 2, 3]);
    expect(valueBoolean).toStrictEqual(true);
  });

  it("does not apply to a string that does not contain hashes", async () => {
    const rawString = "This string does not even get parsed";
    const applied = await dictionary.applyToString(rawString, options);

    expect(applied).toEqual("This string does not even get parsed");
  });

  it("applies the dictionary to a string with words and a single expression", async () => {
    const rawString = "This string contains only one expression: #TEST.APPLY_ONE#.";
    const applied = await dictionary.applyToString(rawString, options);

    expect(applied).toEqual("This string contains only one expression: which is parsed and resolved.");
  });

  it("applies the dictionary to a string with words and expressions without spaces", async () => {
    const rawString = "#TEST.APPLY_MESSY_PART_ONE#and#TEST.APPLY_MESSY_PART_TWO,Second#";
    const applied = await dictionary.applyToString(rawString, options);

    expect(applied).toEqual("FirstPartandSecondPart");
  });

  it("does not apply the dictionary to a string enclosed in hashtags but no expression", async () => {
    const singleValue = await dictionary.applyToString("#NOTSLUG#", options);
    const multiValue = await dictionary.applyToString("#NOTSLUG##HASHTAG#", options);
    const multiValueSpaced = await dictionary.applyToString("#NOTSLUG# #HASHTAG#", options);

    expect(singleValue).toEqual("#NOTSLUG#");
    expect(multiValue).toEqual("#NOTSLUG##HASHTAG#");
    expect(multiValueSpaced).toEqual("#NOTSLUG# #HASHTAG#");
  });

  it("does not apply the dictionary to a string enclosed in hashtags with wrong expression syntax", async () => {
    const almostAnExpression = await dictionary.applyToString("#SLUG.#", options);
    const validSlugInvalidKey = await dictionary.applyToString("#SLUG.invalid_Key#", options);
    const invalidSlugValidKey = await dictionary.applyToString("#notSlug.VALID_KEY#", options);
    const slugWithSpaces = await dictionary.applyToString("#SL UG.VALID_KEY#", options);
    const keyWithSpaces = await dictionary.applyToString("#SLUG.INVALID KEY#", options);
    expect(almostAnExpression).toEqual("#SLUG.#");
    expect(validSlugInvalidKey).toEqual("#SLUG.invalid_Key#");
    expect(invalidSlugValidKey).toEqual("#notSlug.VALID_KEY#");
    expect(slugWithSpaces).toEqual("#SL UG.VALID_KEY#");
    expect(keyWithSpaces).toEqual("#SLUG.INVALID KEY#");
  });

  it("applies the dictionary to a big string covering all the dictionary functionality", async () => {
    const rawString =
      "Simple expression first: #TEST.APPLY_ONE#. Then we have a #TEST.BROKEN_EXPRESSION." +
      " Followed by #TEST.APPLY_ANOTHER_ONE#. Also, #NOTADICT.APPLY_ONE# and #TEST.NON_EXISTING_KEY# are kept as is." +
      ' Finish it with #TEST.APPLY_WITH_COMMA,"a , in the parameter"##TEST.APPLY_WITH_HASH," and #5 has the # symbol"#.';
    const applied = await dictionary.applyToString(rawString, options);

    expect(applied).toEqual(
      "Simple expression first: which is parsed and resolved. Then we have a #TEST.BROKEN_EXPRESSION." +
        " Followed by one to see if the broken one does not break everything after." +
        " Also, #NOTADICT.APPLY_ONE# and #TEST.NON_EXISTING_KEY# are kept as is." +
        " Finish it with one including a , in the parameter and #5 has the # symbol (because # should work here as well)."
    );
  });
});
