/**
 * @internal
 */
function chunk<T>(array: T[], size: number): T[][] {
  if (!Array.isArray(array)) {
    throw new TypeError("Expected an array");
  }

  if (typeof size !== "number" || size < 1) {
    return array.map((): T[] => []);
  }

  const chunked_arr: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunked_arr.push(array.slice(i, i + size));
  }

  return chunked_arr;
}

export { chunk };
