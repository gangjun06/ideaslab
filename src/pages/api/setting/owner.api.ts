import { z } from "zod";
import { getMiddlewares, handler } from "~/lib/api";
import { getSetting, setSetting } from "~/models/setting";
import { UserRole } from "~/types/user";
import { ownerSettingValidator } from "./owner.schema";

export default handler({ skip: true })
  .get(...getMiddlewares({ auth: UserRole.Manager }), async (req, res) => {
    const role = await getSetting("manager_role");
    return res.json({
      managerRole: role,
    } as z.infer<typeof ownerSettingValidator>);
  })
  .post(
    ...getMiddlewares({ auth: UserRole.Admin, schema: ownerSettingValidator }),
    async (req, res) => {
      const { managerRole } = req.data;

      await setSetting("manager_role", managerRole);

      res.json({});
    }
  );
