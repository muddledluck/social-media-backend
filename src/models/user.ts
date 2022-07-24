import { PrismaClient, User } from "@prisma/client";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";
import { CreateSessionInput } from "../modules/session/session.schema";

export default function Users(prismaUser: PrismaClient["user"]) {
  return Object.assign(prisma.user, {
    /**
     * Validate user password. Return true if password is correct
     */
    async comparePassword(data: CreateSessionInput) {
      try {
        const user = await prismaUser.findFirstOrThrow({
          where: { email: data.email },
        });
        const isValid = await bcrypt
          .compare(data.password, user.password)
          .catch((e) => false);
        return isValid ? user : isValid;
      } catch (error) {
        return false;
      }
    },
  });
}
