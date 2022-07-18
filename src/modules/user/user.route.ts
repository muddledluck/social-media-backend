import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import fp from "fastify-plugin";
import { Db } from "../../models";

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {
    db: Db;
  }
}

const userRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  server.get("/", {}, async (request, reply) => {
    try {
      const { User } = server.db.models;
      const users = await User.find({});
      return reply.code(200).send(users);
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });
};

export default fp(userRoute);
