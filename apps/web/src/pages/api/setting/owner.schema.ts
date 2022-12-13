import { z } from "zod";

export const ownerSettingValidator = z.object({
  managerRole: z.string(),
});
