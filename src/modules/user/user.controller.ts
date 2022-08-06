import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, GetUserDetailsByIdInput } from "./user.schema";
import { createUser, findUser } from "./user.service";

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
    console.log(isExist);
    reply.code(201).send(user);
  } catch (error) {
    console.log(error);
    reply.send(500);
  }
}

export async function getUserDetailsById(
  this: FastifyInstance,
  request: FastifyRequest<{
    Querystring: GetUserDetailsByIdInput;
  }>,
  reply: FastifyReply
) {
  // find user with given id or get the details of current user
  const userId = request.query.userId || request.currentUser.id;
  let userDetails = await findUser({ userId });
  if (!userDetails) {
    return reply.code(404);
  } else {
    return reply.code(200).send(userDetails);
  }
}
