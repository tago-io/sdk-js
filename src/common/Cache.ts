type keyName = string;
type expireTimestamp = number;

const cacheObj = new Map<[keyName, expireTimestamp], any>();

function clearCache() {
  for (const item of cacheObj.keys()) {
    if (item[1] < Date.now()) {
      cacheObj.delete(item);
    }
  }
}

function addCache(key: any, obj: any, ttlMS = 5000) {
  clearCache();
  const keyString = JSON.stringify(key);
  cacheObj.set([keyString, Date.now() + ttlMS], obj);
}

function getCache(key: any) {
  clearCache();
  const keyString = JSON.stringify(key);

  for (const item of cacheObj.keys()) {
    if (item[0] === keyString) {
      return cacheObj.get(item);
    }
  }

  return undefined;
}

export { addCache, getCache };
