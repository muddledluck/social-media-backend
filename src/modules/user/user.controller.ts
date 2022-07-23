import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput } from "./user.schema";
import { createUser } from "./user.service";

export async function registerUserHandler(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const { body } = request;
  try {
    const { isExist, user } = await createUser(body);
    if (isExist) return reply.code(409).send({ msg: "User already Exist" });
    reply.code(201).send(user);
  } catch (error) {
    console.log(error);
    reply.send(500);
  }
}
