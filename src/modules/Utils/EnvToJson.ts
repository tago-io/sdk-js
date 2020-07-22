interface EnvItem {
  [key: string]: any;
}
/**
 * Convert Environment Array to Object
 * Note: It will replace duplicate keys for the last one
 * @param environment Array of environment items from TagoIO
 */
function envToJson(environment: EnvItem[]) {
  return environment.reduce((pv, cv) => {
    pv[cv.key] = cv.value;
    return pv;
  }, {});
}

export default envToJson;
