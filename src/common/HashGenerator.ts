import { AxiosRequestConfig } from "axios";

function hashGenerator(obj: any): number {
  const objString = JSON.stringify(obj);

  let hash = 0;
  let chr;

  if (objString.length === 0) {
    return hash;
  }

  for (let i = 0; i < objString.length; i += 1) {
    chr = objString.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

function generateRequestID(axiosObj: AxiosRequestConfig): number {
  const objKey = {
    url: axiosObj.url,
    token: axiosObj.headers?.token,
    params: axiosObj.params,
    body: axiosObj.data,
    method: axiosObj.method,
  };

  const requestID = hashGenerator(objKey);

  return requestID;
}

export { hashGenerator, generateRequestID };
