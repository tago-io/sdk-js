/**
 *  Receive an object and a list of parameters to be parsed to Date object
 */
export default function dateParser<T>(target: T, parameters: (keyof T)[]): T {
  target = { ...target };

  for (const parameter of parameters) {
    const value: unknown = target[parameter];

    if (value && typeof value === "string" && value !== "never") {
      const parsedDate = new Date(value);

      if (!isNaN(parsedDate.getTime())) {
        (target[parameter] as unknown) = parsedDate;
      }
    }
  }

  return target;
}
