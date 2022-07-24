import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import requireUser from "../../preHandler/requireUser";
import {
  createSessionHandler,
  getUserSessionHandler,
} from "./session.controller";
import { $ref } from "./session.schema";

const sessionRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createSessionSchema"),
        response: {
          201: $ref("createSessionResponseSchema"),
        },
      },
    },
    createSessionHandler
  );
  server.get(
    "/",
    {
      schema: {
        response: {
          200: $ref("getUserSessionResponseSchema"),
        },
      },
      preHandler: [requireUser],
    },
    getUserSessionHandler
  );
};

export default sessionRoute;
