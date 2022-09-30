import discord from "lib/discord";
import { handler } from "lib/api";

export type Role = {
  id: string;
  color: string;
  name: string;
  position: number;
};

export type RolesLoaderData = {
  list: Role[];
};

export default handler().get(async (req, res) => {
  const guild = await discord.guilds.fetch(process.env.SERVER_ID || "");
  const guildRoleList = guild?.roles.cache.map(
    ({ id, hexColor, name, position }) => ({
      id,
      color: hexColor,
      name,
      position,
    })
  );

  res.status(200).json({
    list: guildRoleList ?? [],
  } as RolesLoaderData);
});
