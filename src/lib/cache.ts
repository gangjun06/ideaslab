import NodeCache from "node-cache";

export enum Caches {
  Setting,
}

let caches: { [key in Caches]: NodeCache };

declare global {
  // eslint-disable-next-line no-var
  var __caches__: { [key in Caches]: NodeCache };
}

if (process.env.NODE_ENV === "production") {
  const result: any = {};
  for (const d in Caches) {
    result[d] = new NodeCache({ stdTTL: 100, checkperiod: 120 });
  }
  caches = result;
} else {
  if (!global.__caches__) {
    console.log("Init cache");
    const result: any = {};
    for (const d in Caches) {
      result[d] = new NodeCache({ stdTTL: 100, checkperiod: 120 });
    }
    global.__caches__ = result;
  }
  caches = global.__caches__;
}

export const getCache = (cacheName: Caches) => caches[cacheName];
