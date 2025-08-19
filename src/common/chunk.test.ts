import { chunk } from "./chunk.ts";

describe("chunk", () => {
  it("should divide an array into chunks of the specified size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it("should return an array of empty arrays when size is less than 1", () => {
    expect(chunk([1, 2, 3, 4, 5], 0)).toEqual([[], [], [], [], []]);
    expect(chunk([1, 2, 3, 4, 5], -1)).toEqual([[], [], [], [], []]);
  });

  it("should throw an error when input is not an array", () => {
    expect(() => chunk(123 as any, 2)).toThrow("Expected an array");
    expect(() => chunk("string" as any, 2)).toThrow("Expected an array");
  });
});
