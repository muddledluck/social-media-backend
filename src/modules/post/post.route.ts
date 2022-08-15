import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import requireUser from "../../preHandler/requireUser";
import {
  createPostHandler,
  getUsersFeedPostHandler,
  getUsersTimelinePostHandler,
  toggleVoteHandler,
} from "./post.controller";
import { $ref } from "./post.schema";

const postRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createPostSchema"),
        // response: {
        //   200: $ref("postResponseSchema"),
        // },
      },
      preHandler: [requireUser],
    },
    createPostHandler
  );
  server.get(
    "/timeline",
    {
      schema: {
        response: {
          200: $ref("arrayPostResponseSchema"),
        },
      },
      preHandler: [requireUser],
    },
    getUsersTimelinePostHandler
  );
  server.get(
    "/feed",
    {
      schema: {
        response: {
          200: $ref("arrayPostResponseSchema"),
        },
      },
      preHandler: [requireUser],
    },
    getUsersFeedPostHandler
  );

  server.put(
    "/toggle-like/:postId",
    {
      schema: {
        params: $ref("toggleVoteSchema"),
        response: {
          200: $ref("toggleVoteResponseSchema"),
        },
      },
      preHandler: [requireUser],
    },
    toggleVoteHandler
  );
};

export default postRoute;
