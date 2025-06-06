/**
 *  Receive an object and a list of parameters to be parsed to Date object
 */
export default function dateParser<T>(target: T, parameters: (keyof T)[]): T {
  const normalizedTarget = { ...target };

  for (const parameter of parameters) {
    const value: unknown = normalizedTarget[parameter];

    if (value && typeof value === "string" && value !== "never") {
      const parsedDate = new Date(value);

      if (!Number.isNaN(parsedDate.getTime())) {
        (normalizedTarget[parameter] as unknown) = parsedDate;
      }
    }
  }

  return normalizedTarget;
}
