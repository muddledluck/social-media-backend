import Fastify from "fastify";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import config from "config";
import swagger from "@fastify/swagger";
import cors from "@fastify/cors";
import ROUTES from "./routes";
import { userSchema } from "./modules/user/user.schema";
import { withRefResolver } from "fastify-zod";
import { version } from "../package.json";
import prisma from "./utils/prisma";

import { sessionSchema } from "./modules/session/session.schema";
import { JWT } from "@fastify/jwt";
import { deserializedUser } from "./utils/hooks";
import { userVerifyJWTPayloadType } from "./utils/type";
dotenv.config();

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
    currentUser: userVerifyJWTPayloadType;
  }
}

prisma.$use(async (params, next) => {
  if (params.model === "User") {
    if (params.action === "create") {
      const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
      const hash = bcrypt.hashSync(params.args.data.password, salt);
      params.args.data.password = hash;
    }
  }
  const result: any = await next(params);

  return result;
});

const port = Number(process.env.PORT) || 5001;
const server = Fastify({
  logger: {
    transport:
      process.env.NODE_ENV === "production"
        ? undefined
        : {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname,reqId",
              colorize: true,
              mkdir: true,
            },
          },
  },
});
server.register(require("@fastify/jwt"), {
  secret: {
    private: process.env.PRIVATE_KEY,
    public: config.get("publicKey"),
  },
  sign: { algorithm: "RS256" },
});

server.get("/health-check", async function () {
  return { status: "OK" };
});

async function main() {
  for (const schema of [...userSchema, ...sessionSchema]) {
    server.addSchema(schema);
  }
  server.register(
    swagger,
    withRefResolver({
      routePrefix: "/docs",
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: "Social Media API",
          description: "Social Media API's",
          version,
        },
      },
    })
  );
  await server.register(cors, {
    origin: (origin, cb) => {
      let hostname;
      try {
        hostname = new URL(origin).hostname;
        console.log({ hostname, origin });
      } catch (error) {
        hostname = "localhost";
      }
      if (hostname === "localhost" || hostname === process.env.FRONTEND_URL) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }
      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed"), false);
    },
    allowedHeaders: ["Content-Type", "Authorization", "X-refresh"],
    exposedHeaders: ["refreshToken", "accessToken"],
  });
  server.addHook("onRequest", deserializedUser);

  ROUTES.forEach((item) => {
    server.register(item.route, item.options);
  });
  try {
    await server.listen({
      port,
      host: "0.0.0.0",
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
main();
