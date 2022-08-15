import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { CreateSessionInput } from "../modules/session/session.schema";

export default function Users(prismaUser: PrismaClient["user"]) {
  return Object.assign(prismaUser, {
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
