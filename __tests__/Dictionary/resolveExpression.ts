import type { MockInstance } from "vitest";
import { Dictionary } from "../../src/modules";

import { enUS, ptBR } from "./__mocks__/dictionaries";

describe("resolveExpression", () => {
  let dictionary: Dictionary;
  let fn: MockInstance;

  beforeAll(() => {
    dictionary = new Dictionary({ token: "mockToken" });

    // Mock the function that gets data from the API
    fn = vi.spyOn(dictionary, "getLanguagesData").mockImplementation(async (slug, language) => {
      return language === "pt-BR" ? ptBR[slug] : enUS[slug];
    });
  });

  it("resolves an expression with a single parameter", async () => {
    const expression = dictionary.parseExpression("#TEST.TEST_RESOLVE_SINGLE_PARAM,123#");
    const resolved = await dictionary.resolveExpression({
      language: "en-US",
      expression,
    });

    expect(resolved).toEqual("Resolved single param 123");
  });

  it("resolves an expression with more than one parameter", async () => {
    const expression = dictionary.parseExpression("#TEST.TEST_RESOLVE_THREE_PARAMS,123,456,789#");
    const resolved = await dictionary.resolveExpression({
      language: "en-US",
      expression,
    });

    expect(resolved).toEqual("Resolved params: 1 = 123, 2 = 456, 3 = 789");
  });

  it("resolves an expression with three parameters passing only the first argument", async () => {
    const expression = dictionary.parseExpression("#TEST.TEST_RESOLVE_THREE_PARAMS,123#");
    const resolved = await dictionary.resolveExpression({
      language: "en-US",
      expression,
    });

    expect(resolved).toEqual("Resolved params: 1 = 123, 2 = $1, 3 = $2");
  });

  it("resolves an expression with three arguments, including quotes commas and hashes", async () => {
    const expression = dictionary.parseExpression('#TEST.TEST_RESOLVE_THREE_PARAMS,"1,23","#456","#789 & #10"#');
    const resolved = await dictionary.resolveExpression({
      language: "en-US",
      expression,
    });

    expect(resolved).toEqual("Resolved params: 1 = 1,23, 2 = #456, 3 = #789 & #10");
  });

  it("resolves an expression with one parameter passing more than one argument", async () => {
    const expression = dictionary.parseExpression("#TEST.TEST_RESOLVE_SINGLE_PARAM,789,456,123#");
    const resolved = await dictionary.resolveExpression({
      language: "en-US",
      expression,
    });

    expect(resolved).toEqual("Resolved single param 789");
  });

  it("resolves an expression with a dollar sign on the value string", async () => {
    const expression = dictionary.parseExpression('#TEST.BALANCE_LABEL,"499,99"#');
    const resolved = await dictionary.resolveExpression({
      language: "pt-BR",
      expression,
    });

    expect(resolved).toEqual("Saldo (BRL): R$ 499,99");
  });
});
