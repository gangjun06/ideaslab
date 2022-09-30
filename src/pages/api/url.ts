import { NextApiRequest, NextApiResponse } from "next";

export const DiscordRolesURL = () => `/api/discord/roles`;

export default function Urls(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({ msg: "Not Found" });
}
