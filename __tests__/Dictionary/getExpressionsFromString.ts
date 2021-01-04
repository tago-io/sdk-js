import { Dictionary } from "../../src/modules";

describe("getExpressionsFromString", () => {
  let dictionary: Dictionary;
  beforeAll(() => {
    dictionary = new Dictionary();
  });

  it("gets expressions from a well separated string", async () => {
    const parsed = await dictionary.getExpressionsFromString("aaa #TEST.TEST_KEY# #TEST.ANOTHER_TEST_KEY# bbb");

    expect(parsed).toEqual([
      { dictionary: "TEST", key: "TEST_KEY" },
      { dictionary: "TEST", key: "ANOTHER_TEST_KEY" },
    ]);
  });

  it("gets expressions from a string with no spaces or anything between words and expressions", async () => {
    const parsed = await dictionary.getExpressionsFromString(
      "aaa#TEST.TEST_KEY#bbb#TEST.ANOTHER_TEST_KEY#ccc#TEST.LAST_TEST_KEY#ddd"
    );

    expect(parsed).toEqual([
      { dictionary: "TEST", key: "TEST_KEY" },
      { dictionary: "TEST", key: "ANOTHER_TEST_KEY" },
      { dictionary: "TEST", key: "LAST_TEST_KEY" },
    ]);
  });

  it("gets expressions from a messy string including parameters with commas inside quotes", async () => {
    const parsed = await dictionary.getExpressionsFromString(
      'aaa,"quoted",aaa#TEST.TEST_KEY,123,456#bbb#TEST.ANOTHER_TEST_KEY,"123,456","789, 10, 11"#ccc'
    );

    expect(parsed).toEqual([
      { dictionary: "TEST", key: "TEST_KEY", params: ["123", "456"] },
      { dictionary: "TEST", key: "ANOTHER_TEST_KEY", params: ["123,456", "789, 10, 11"] },
    ]);
  });

  it("gets expressions from a messy string including parameters with commas inside quotes", async () => {
    const parsed = await dictionary.getExpressionsFromString(
      'aaa,"quoted",aaa#TEST.TEST_KEY,123,456#bbb#TEST.ANOTHER_TEST_KEY,"#123,#456","#789, #10, #11"#ccc'
    );

    expect(parsed).toEqual([
      { dictionary: "TEST", key: "TEST_KEY", params: ["123", "456"] },
      { dictionary: "TEST", key: "ANOTHER_TEST_KEY", params: ["#123,#456", "#789, #10, #11"] },
    ]);
  });

  it("does not get any expression if the string doesn't contain one", async () => {
    const parsed = await dictionary.getExpressionsFromString("regular string with no expressions");

    expect(parsed).toEqual([]);
  });

  it("does not get any expression if the string has an expression without the closing hash", async () => {
    const parsed = await dictionary.getExpressionsFromString("a non-closed #TEST.EXPRESSION and nothing else");

    expect(parsed).toEqual([]);
  });

  it("does not get any expression if the string more than one expression without the closing hash", async () => {
    const parsed = await dictionary.getExpressionsFromString(
      "not expressions: #TEST.EXPRESSION and #TEST.ANOTHER_ONE #123"
    );

    expect(parsed).toEqual([]);
  });
});
