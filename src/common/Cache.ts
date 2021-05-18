import sleep from "./sleep";

type keyName = string;
type expireTimestamp = number;

const cacheObj = new Map<[keyName, expireTimestamp], any>();
const requestInProgress = new Set<string>();

function clearCacheTTL() {
  for (const item of cacheObj.keys()) {
    if (item[1] < Date.now()) {
      cacheObj.delete(item);
    }
  }
}

function addCache(key: string, obj: any, ttlMS = 5000) {
  clearCacheTTL();
  requestInProgress.delete(key);
  cacheObj.set([key, Date.now() + ttlMS], obj);
}

async function getCache(key: string): Promise<any> {
  clearCacheTTL();

  if (requestInProgress.has(key)) {
    await sleep(100);
    return getCache(key);
  }

  for (const item of cacheObj.keys()) {
    if (item[0] === key) {
      return cacheObj.get(item);
    }
  }

  requestInProgress.add(key);
  return undefined;
}

function removeRequestInprogress(key: string) {
  requestInProgress.delete(key);
}

function clearCache() {
  cacheObj.clear();
}

export { addCache, getCache, clearCache, removeRequestInprogress };
