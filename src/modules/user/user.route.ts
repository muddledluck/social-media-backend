import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import requireUser from "../../preHandler/requireUser";
import { getUserDetailsById, registerUserHandler } from "./user.controller";
import { $ref } from "./user.schema";

// Declaration merging

const userRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
          409: $ref("createUserDuplicateResponse"),
        },
      },
    },
    registerUserHandler
  );
  server.get(
    "/",
    {
      schema: {
        querystring: $ref("getUserDetailsByIdSchema"),
        response: {
          200: $ref("getUserDetailsByIdResponseSchema"),
        },
      },
      preHandler: [requireUser],
    },
    getUserDetailsById
  );
};

export default userRoute;
