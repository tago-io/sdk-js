import { Dictionary } from "../../src/modules";

describe("parseExpression", () => {
  let dictionary: Dictionary;

  beforeAll(() => {
    dictionary = new Dictionary({ token: "mockToken" });
  });

  it("parses an expression without parameters", () => {
    const parsed = dictionary.parseExpression("#TEST.TEST_KEY#");

    expect(parsed).toEqual({ dictionary: "TEST", key: "TEST_KEY" });
  });

  it("parses an expression with one parameter", () => {
    const parsed = dictionary.parseExpression("#TEST.TEST_KEY,a#");

    expect(parsed).toEqual({ dictionary: "TEST", key: "TEST_KEY", params: ["a"] });
  });

  it("parses an expression with three parameters", () => {
    const parsed = dictionary.parseExpression("#TEST.TEST_KEY,a,bb,ccc#");

    expect(parsed).toEqual({ dictionary: "TEST", key: "TEST_KEY", params: ["a", "bb", "ccc"] });
  });

  it("parses an expression with three parameters normal parameters and one quoted with a comma", () => {
    const parsed = dictionary.parseExpression('#TEST.TEST_KEY,a,bb,ccc,"ddd,d"#');

    expect(parsed).toEqual({ dictionary: "TEST", key: "TEST_KEY", params: ["a", "bb", "ccc", "ddd,d"] });
  });

  it("parses an expression with three parameters normal parameters and one quoted with a hashtag", () => {
    const parsed = dictionary.parseExpression('#TEST.TEST_KEY,a,bb,ccc,"ddd#d"#');

    expect(parsed).toEqual({ dictionary: "TEST", key: "TEST_KEY", params: ["a", "bb", "ccc", "ddd#d"] });
  });
});
