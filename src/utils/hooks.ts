import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { JWT } from "@fastify/jwt";
import config from "config";
import { userVerifyJWTPayloadType } from "./type";
import prisma from "./prisma";

// !TODO: define type of data
interface IHeaders {
  "x-refresh": string;
}

const verifyJwt = (jwt: JWT, token: string) => {
  try {
    const decoded: userVerifyJWTPayloadType = jwt.verify(token);
    if (typeof decoded === "object") {
      return {
        valid: true,
        expired: false,
        decoded,
      };
    } else {
      throw new Error("Invalid Jwt");
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.code === "FAST_JWT_EXPIRED",
      decoded: null,
    };
  }
};

export async function deserializedUser(
  this: FastifyInstance,
  request: FastifyRequest<{
    Headers: IHeaders;
  }>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const accessToken = (request.headers["authorization"] || "").replace(
    /^Bearer\s/,
    ""
  );
  const refreshToken = (request.headers["x-refresh"] || "").replace(
    /^Bearer\s/,
    ""
  );
  if (!accessToken) {
    return;
  }
  const { decoded, expired } = verifyJwt(this.jwt, accessToken);
  if (decoded) {
    const session = await prisma.session.findFirst({
      where: { id: decoded.session },
    });
    if (!session || !session.valid) return;
    request.currentUser = decoded;
  }

  if (expired && refreshToken) {
    const { decoded, expired, valid } = verifyJwt(this.jwt, refreshToken);
    if (!decoded) {
      return;
    } else {
      const session = await prisma.session.findFirst({
        where: { id: decoded.session },
      });
      if (!session || !session.valid) return;
      const user = await prisma.user.findFirst({
        where: { id: session.userId },
      });
      if (!user) return done();
      const payload: userVerifyJWTPayloadType = {
        ...user,
        session: session.id,
      };
      request.currentUser = payload;
      const newAccessToken = this.jwt.sign(payload, {
        expiresIn: config.get<number>("accessTokenTTL"),
      });
      reply.header("accessToken", newAccessToken);
    }
  }
}
