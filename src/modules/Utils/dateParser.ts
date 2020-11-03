export default function dateParser<T>(date: T, parameters: (keyof T)[]): T {
  for (const parameter of parameters) {
    const value: unknown = date[parameter];
    if (value && typeof value === "string" && value !== "never") {
      const parsedDate = new Date(value as string);
      if (!isNaN(parsedDate.getTime())) {
        ((date[parameter] as unknown) as Date) = parsedDate;
      }
    }
  }

  return date;
}

// interface test {
//   a: Date;
//   b: string;
// }
// const asd = { a: "2020-09-28T18:10:21.000Z", b: "never" };
// console.log(
//   // @ts-ignore
//   dateParser<test>(asd, ["a", "b"])
// );

// console.log(typeof asd.a);
