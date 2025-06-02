import removeHttpFromURL from "../../src/modules/Migration/common/removeHttpFromURL";

describe("removeHttpFromURL - migration suite", () => {
  it("removes HTTP(s) from URLs correctly", () => {
    const url = "https://tago.io";
    const url2 = "http://tago.io";
    const url3 = "tago.io";

    expect(removeHttpFromURL(url)).toEqual("tago.io");
    expect(removeHttpFromURL(url2)).toEqual("tago.io");
    expect(removeHttpFromURL(url3)).toEqual("tago.io");
    expect(removeHttpFromURL(undefined)).toEqual("");
    expect(removeHttpFromURL("/")).toEqual("");
  });
});
