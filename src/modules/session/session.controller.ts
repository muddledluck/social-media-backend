import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import config from "config";
import { validatePassword } from "../user/user.service";
import { CreateSessionInput } from "./session.schema";
import { createSession, getSessionById } from "./session.service";
import { userVerifyJWTPayloadType } from "../../utils/type";

export async function createSessionHandler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateSessionInput;
  }>,
  reply: FastifyReply
) {
  // validating Password
  const user = await validatePassword(request.body);
  if (!user) {
    reply.code(401).send({ msg: "Invalid Email or Password" });
  } else {
    // create session
    const session = await createSession(
      user.id,
      request.headers["user-agent"] || ""
    );
    const payload: userVerifyJWTPayloadType = {
      ...user,
      session: session.id,
    };
    // create access token
    const accessToken = this.jwt.sign(payload, {
      expiresIn: config.get<number>("accessTokenTTL"),
    });
    // create  refresh token
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: config.get<number>("refreshTokenTTL"),
    });
    // return access token & refresh token
    reply.header("accessToken", accessToken);
    reply.header("refreshToken", refreshToken);
    return reply.code(201).send({
      message: "Login Successfully",
    });
  }
}

export async function getUserSessionHandler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateSessionInput;
  }>,
  reply: FastifyReply
) {
  const userId = request.currentUser.id;
  const session = await getSessionById(userId);
  return reply.code(200).send(session);
}
