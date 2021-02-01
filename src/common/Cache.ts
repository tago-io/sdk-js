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

setInterval(clearCache, 999);

function addCache(key: any, obj: any, ttlMS = 5000) {
  const keyString = JSON.stringify(key);
  cacheObj.set([keyString, Date.now() + ttlMS], obj);
}

function getCache(key: any) {
  const keyString = JSON.stringify(key);

  for (const item of cacheObj.keys()) {
    if (item[0] === keyString) {
      return cacheObj.get(item);
    }
  }

  return undefined;
}

export { addCache, getCache };
