import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import fp from "fastify-plugin";
import mongoose from "mongoose";
import { UserModel, User } from "./users/user.model";

export interface Models {
  User: UserModel;
}

export interface Db {
  models: Models;
}

// define options
export interface MyPluginOptions {
  uri: string;
}

const ConnectDB: FastifyPluginAsync<MyPluginOptions> = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  try {
    mongoose.connection.on("connected", () => {
      fastify.log.info({ actor: "MongoDB" }, "connected");
    });
    mongoose.connection.on("disconnected", () => {
      fastify.log.error({ actor: "MongoDB" }, "disconnected");
    });
    const db = await mongoose.connect(options.uri);
    const models: Models = { User };
    fastify.decorate("db", { models });
  } catch (error) {
    console.log(error);
  }
};

export default fp(ConnectDB);
