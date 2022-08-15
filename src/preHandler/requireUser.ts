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
    Body: any;
    Params: any;
    Querystring: any;
  }>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const user = request.currentUser;
  if (!user) {
    return reply.code(403).send({
      message: "Authorization Error",
    });
  }
  done();
}
export default requireUser;
