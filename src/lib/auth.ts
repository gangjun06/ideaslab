import { NextApiRequest } from "next";
import { unstable_getServerSession } from "next-auth";
import { Middleware } from "next-connect";
import { authOptions } from "~/pages/api/auth/[...nextauth]";
import { DefaultRequest, DefaultResponse } from "types/api";
import { UserRole } from "~/types/user";

export const auth = (userRole: UserRole) => {
  const func: Middleware<DefaultRequest<any>, DefaultResponse> = async (
    req,
    res,
    next
  ) => {
    const session = await unstable_getServerSession(
      req as NextApiRequest,
      res,
      authOptions
    );

    const unauthorization = () => {
      res.status(401).json({ msg: "Authentication failed" });
    };

    if (!session || !session.user) return unauthorization();
    req.user = session.user;

    if (session.user.role === UserRole.Admin) {
      return next();
    }

    if (userRole !== session.user.role) {
      return unauthorization();
    }

    next();
  };
  return func;
};
