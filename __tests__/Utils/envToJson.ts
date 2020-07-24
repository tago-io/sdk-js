import envToJson from "../../src/modules/Utils/envToJson";

describe("TagoIO Env to JSON", () => {
  test("Transform with success", () => {
    const envMock = [
      { key: "test", value: "valueTest" },
      { key: "test2", value: "valueTest2" },
    ];
    const result = envToJson(envMock);
    expect(result.test).toEqual("valueTest");
    expect(result.test2).toEqual("valueTest2");
  });

  test("Transform with multiples values with same key", () => {
    const envMock = [
      { key: "test", value: "valueTest" },
      { key: "test", value: "valueTest3" },
    ];
    const result = envToJson(envMock);
    expect(result.test).toEqual("valueTest3");
  });
});
