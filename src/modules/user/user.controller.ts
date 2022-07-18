import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServerType } from "../../models";

export const registerUserHandler =
  (server: ServerType) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(server.db);
  };
