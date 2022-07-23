import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import { registerUserHandler } from "./user.controller";
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
};

export default userRoute;
