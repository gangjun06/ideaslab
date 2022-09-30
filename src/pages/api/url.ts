import { NextApiRequest, NextApiResponse } from "next";

export default function Urls(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({ msg: "Not Found" });
}
