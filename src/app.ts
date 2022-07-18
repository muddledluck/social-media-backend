import Fastify from "fastify";
import dotenv from "dotenv";
import config from "config";
import db from "./models";
import ROUTES from "./routes";
import userRoute from "./modules/user/user.route";
dotenv.config();
const port = Number(process.env.PORT) || 5001;
const server = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
      },
    },
  },
});

server.get("/health-check", async function () {
  return { status: "OK" };
});

async function main() {
  server.register(db, config.get("db"));
  server.register(userRoute);
  // ROUTES.forEach((item) => {
  //   server.register(item.route, item.options);
  // });
  try {
    await server.listen({
      port,
      host: "0.0.0.0",
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
main();
