import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { CreateSessionInput } from "../modules/session/session.schema";

function requireUser(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateSessionInput;
  }>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const user = request.currentUser;
  console.log({ user: user });
  if (!user) {
    reply.code(403).send({
      message: "Authorization Error",
    });
  }
  done();
}
export default requireUser;
