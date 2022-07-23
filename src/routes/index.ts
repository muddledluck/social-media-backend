import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import userRoute from "../modules/user/user.route";

interface RoutesInterface {
  route: FastifyPluginAsync;
  options: FastifyPluginOptions;
}

// !TODO: Create Type of ROUTES array
const ROUTES: RoutesInterface[] = [
  {
    route: userRoute,
    options: {
      prefix: "/api/users",
    },
  },
];

export default ROUTES;
