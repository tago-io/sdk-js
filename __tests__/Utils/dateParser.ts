import dateParser from "../../src/modules/Utils/dateParser.ts";

describe("Object parameter date parser", () => {
  test("Should work with data string", () => {
    let data = {
      a: "2020-09-28T18:10:21.000Z",
      b: "test",
    };

    data = dateParser(data, ["a"]);
    // @ts-ignore
    expect(data.a instanceof Date).toBeTruthy();
    expect(data.b).toEqual("test");
  });

  test('Should work with "never" value', () => {
    let data = {
      a: "2020-09-28T18:10:21.000Z",
      b: "never",
    };

    data = dateParser(data, ["a", "b"]);
    // @ts-ignore
    expect(data.a instanceof Date).toBeTruthy();
    expect(data.b).toEqual("never");
  });

  test("Should not parse non Date value", () => {
    let data = {
      a: "this is not a Date",
      b: "test",
    };

    data = dateParser(data, ["a"]);
    // @ts-ignore
    expect(data.a instanceof Date).toBeFalsy();
    expect(data.b).toEqual("test");
  });

  test("Input object should be different from output", () => {
    const dataInput = {
      a: "2020-09-28T18:10:21.000Z",
    };

    const dataResult = dateParser(dataInput, ["a"]);
    // @ts-ignore
    expect(dataResult).not.toEqual(dataInput);
  });
});
