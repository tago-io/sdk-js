import { Dictionary } from "../../src/modules";

describe("applyToString", () => {
  let dictionary: Dictionary;
  let options: Object;

  beforeAll(() => {
    dictionary = new Dictionary();
    options = { language: "en-US" };
  });

  it("does not run if the string is undefined", async () => {
    const noString = await dictionary.applyToString(undefined, options);
    const noLanguage = await dictionary.applyToString("Some string", undefined);

    expect(noString).toEqual("");
    expect(noLanguage).toEqual("Some string");
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
