/**
 * Remove HTTP and HTTPS from the URL on links to media and other assets.
 * Return an empty string if the value is not a string.
 */
export default function removeHttpFromURL(url: any): string {
  if (typeof url !== "string") {
    return "";
  }

  let result: string = url.replace(/(^\w+:|^)\/\//, "");

  if (result[result.length - 1] === "/") {
    result = result.substring(0, result.length - 1);
  }

  return result;
}
