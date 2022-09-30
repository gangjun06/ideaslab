import { Caches, getCache } from "~/lib/cache";
import prisma from "~/lib/db";

export type Keys = "manager_role";

export const getSetting = async (key: Keys) => {
  const cache = getCache(Caches.Setting).get(key) as string;
  if (cache) return cache;

  const result = await prisma.setting.findUnique({ where: { key } });
  getCache(Caches.Setting).set(key, result?.value);
  return result?.value;
};

export const setSetting = async (key: Keys, value: string) => {
  await prisma.setting.upsert({
    create: { key, value },
    where: { key },
    update: { value },
  });

  getCache(Caches.Setting).set(key, value);
};
