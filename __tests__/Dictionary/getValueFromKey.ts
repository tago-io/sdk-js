import type { MockInstance } from "vitest";

import { Dictionary } from "../../src/modules";
import { enUS, ptBR } from "./__mocks__/dictionaries";

describe("getValueFromKey", () => {
  let dictionary: Dictionary;
  let fn: MockInstance;

  beforeAll(() => {
    dictionary = new Dictionary({ token: "mockToken" });

    // Mock the function that gets data from the API
    fn = vi.spyOn(dictionary, "getLanguagesData").mockImplementation(async (slug, language) => {
      return language === "pt-BR" ? ptBR[slug] : enUS[slug];
    });
  });

  it("does not get a value with one or more missing parameters", async () => {
    expect(async () => await dictionary.getValueFromKey(undefined, "TEST", "TEST_KEY")).rejects.toThrow();
    expect(async () => await dictionary.getValueFromKey("en-US", undefined, "TEST_KEY")).rejects.toThrow();
    expect(async () => await dictionary.getValueFromKey("en-US", "TEST", undefined)).rejects.toThrow();
  });

  it("return the expression as is if the dictionary does not exist", async () => {
    const value = await dictionary.getValueFromKey("en-US", "DOESNTEXIST", "TEST_KEY");

    expect(value).toBe("#DOESNTEXIST.TEST_KEY#");
  });

  it("return the expression as is if the key is not present in a dictionary", async () => {
    const value = await dictionary.getValueFromKey("en-US", "TEST", "TEST_KEY_NOT_IN_DICT");

    expect(value).toBe("#TEST.TEST_KEY_NOT_IN_DICT#");
  });

  it("gets a value if the dictionary exists and the key is present", async () => {
    const value = await dictionary.getValueFromKey("en-US", "TEST", "TEST_KEY");

    expect(value).toBe("Some test value");
  });
});
