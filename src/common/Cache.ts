type keyName = string;
type expireTimestamp = number;

const cacheObj = new Map<[keyName, expireTimestamp], any>();

function clearCacheTTL() {
  for (const item of cacheObj.keys()) {
    if (item[1] < Date.now()) {
      cacheObj.delete(item);
    }
  }
}

function addCache(key: string, obj: any, ttlMS = 5000) {
  clearCacheTTL();
  cacheObj.set([key, Date.now() + ttlMS], obj);
}

function getCache(key: string) {
  clearCacheTTL();

  for (const item of cacheObj.keys()) {
    if (item[0] === key) {
      return cacheObj.get(item);
    }
  }

  return undefined;
}

function clearCache() {
  cacheObj.clear();
}

export { addCache, getCache, clearCache };
