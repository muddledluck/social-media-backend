import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import postRoute from "../modules/post/post.route";
import sessionRoute from "../modules/session/session.route";
import userRoute from "../modules/user/user.route";

interface RoutesInterface {
  route: FastifyPluginAsync;
  options: FastifyPluginOptions;
}

const ROUTES: RoutesInterface[] = [
  {
    route: userRoute,
    options: {
      prefix: "/api/users",
    },
  },
  {
    route: sessionRoute,
    options: {
      prefix: "/api/session",
    },
  },
  {
    route: postRoute,
    options: {
      prefix: "/api/post",
    },
  },
];

export default ROUTES;
