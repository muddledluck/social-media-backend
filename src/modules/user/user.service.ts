import Users from "../../models/user";
import prisma from "../../utils/prisma";
import { CreateSessionInput } from "../session/session.schema";
import { CreateUserInput, GetUserDetailsByIdInput } from "./user.schema";
const User = Users(prisma.user);
export async function createUser(input: CreateUserInput) {
  const user = await User.findFirst({
    where: { email: input.email },
  });
  if (user) {
    return {
      isExist: true,
      user,
    };
  }
  const newUser = await User.create({
    data: {
      ...input,
    },
  });
  return {
    isExist: false,
    user: newUser,
  };
}

export async function validatePassword(input: CreateSessionInput) {
  return User.comparePassword(input);
}

export async function findUser(input: GetUserDetailsByIdInput) {
  const userDetails = User.findFirst({
    where: { id: input.userId },
    include: { Profile: true },
  });
  return userDetails;
}
