import { z } from "zod";
import superjson from "superjson";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect, { Middleware, Options } from "next-connect";
import { DefaultRequest, DefaultResponse } from "types/api";
import { auth } from "./auth";
import { NotFoundError } from "@prisma/client/runtime";
import { UserRole } from "~/types/user";

export const getAPIQuery = (
  req: NextApiRequest,
  res: NextApiResponse,
  name: string
) => {
  const data = req.query[name];
  if (typeof data !== "string") {
    res.status(400).json({ msg: "Bad Request" });
    return null;
  }
  return data;
};

type parserSchemaType = z.ZodEffects<any> | z.ZodObject<any>;

export const parser = <T extends parserSchemaType>(schema: T) => {
  const func: Middleware<DefaultRequest<z.infer<T>>, DefaultResponse> = async (
    req,
    res,
    next
  ) => {
    const parsed = await schema.safeParseAsync(superjson.deserialize(req.body));
    if (!parsed.success) {
      res.status(400).json({ msg: "Bad Request" });
      return;
    }
    req.data = parsed.data;
    next();
  };
  return func;
};

export const parseQuery = <T extends parserSchemaType>(schema: T) => {
  const func: Middleware<DefaultRequest<z.infer<T>>, DefaultResponse> = async (
    req,
    res,
    next
  ) => {
    const parsed = await schema.safeParseAsync(req.query);
    if (!parsed.success) {
      res.status(400).json({ msg: "Bad Request" });
      return;
    }
    req.queryData = parsed.data;
    next();
  };
  return func;
};

export const nextConnectOptions: Options<
  DefaultRequest<z.TypeOf<any>>,
  DefaultResponse
> = {
  onError: (err, _req, res, _next) => {
    if (err instanceof NotFoundError) {
      res.status(404).json({ msg: "Not Found!" });
    } else {
      console.log(err);
      res.status(500).end("Something broke!");
    }
  },
  onNoMatch: (_req, res) => {
    res.status(404).end("Page is not found");
  },
};

interface HandlerOptions<
  T extends parserSchemaType,
  U extends parserSchemaType
> {
  schema?: T;
  options?: any;
  auth?: UserRole | null;
  query?: U;
}

export const defaultHandlerOptions: HandlerOptions<any, any> = {
  options: nextConnectOptions,
  auth: UserRole.User,
};

export const handler = <T extends parserSchemaType, U extends parserSchemaType>(
  options?: HandlerOptions<T, U>
) => {
  let {
    schema = null,
    options: ncOptions = defaultHandlerOptions.options,
    auth: useAuth,
    query = defaultHandlerOptions.query,
  } = options || {};

  if (useAuth === undefined) {
    useAuth = defaultHandlerOptions.auth;
  }

  let handler = nextConnect<
    DefaultRequest<z.infer<T>, z.infer<U>>,
    DefaultResponse
  >(ncOptions);

  if (useAuth) handler = handler.use(auth(useAuth));
  if (query) handler = handler.use(parseQuery(query));
  if (schema) handler = handler.use(parser(schema));

  return handler;
};
