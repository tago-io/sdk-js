import dateParser from "../../src/modules/Utils/dateParser";

describe("Object parameter date parser", () => {
  test("Should work with data string", () => {
    const data = {
      a: "2020-09-28T18:10:21.000Z",
      b: "test",
    };

    dateParser(data, ["a"]);
    // @ts-ignore
    expect(data.a instanceof Date).toBeTruthy();
    expect(data.b).toEqual("test");
  });

  test('Should work with "never" value', () => {
    const data = {
      a: "2020-09-28T18:10:21.000Z",
      b: "never",
    };

    dateParser(data, ["a", "b"]);
    // @ts-ignore
    expect(data.a instanceof Date).toBeTruthy();
    expect(data.b).toEqual("never");
  });

  test("Should not parse non Date value", () => {
    const data = {
      a: "this is not a Date",
      b: "test",
    };

    dateParser(data, ["a"]);
    // @ts-ignore
    expect(data.a instanceof Date).toBeFalsy();
    expect(data.b).toEqual("test");
  });

  test("Should work with array", () => {
    const data = [
      {
        a: "2020-09-28T18:10:21.000Z",
        b: "test",
      },
      {
        a: "2020-09-28T18:10:21.000Z",
        b: "test",
      },
    ];

    // @ts-ignore
    dateParser(data, ["a"]);
    // @ts-ignore
    expect(data[0].a instanceof Date).toBeTruthy();
    expect(data[0].b).toEqual("test");
    // @ts-ignore
    expect(data[1].a instanceof Date).toBeTruthy();
    expect(data[1].b).toEqual("test");
  });
});
