import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export async function createUser(input: CreateUserInput) {
  const user = await prisma.user.findFirst({
    where: { email: input.email },
  });
  if (user) {
    return {
      isExist: true,
      user,
    };
  }
  const newUser = await prisma.user.create({
    data: {
      ...input,
    },
  });
  return {
    isExist: false,
    user: newUser,
  };
}
