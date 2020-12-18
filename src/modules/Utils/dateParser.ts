export default function dateParser<T>(date: T | T[], parameters: (keyof T)[]): T | T[] {
  const dateArray = Array.isArray(date) ? date : [date];
  for (const dateItem of dateArray) {
    for (const parameter of parameters) {
      const value: unknown = dateItem[parameter];
      if (value && typeof value === "string" && value !== "never") {
        const parsedDate = new Date(value as string);
        if (!isNaN(parsedDate.getTime())) {
          ((dateItem[parameter] as unknown) as Date) = parsedDate;
        }
      }
    }
  }

  return date;
}
