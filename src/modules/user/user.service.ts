import { UserModel } from "../../utils/prisma";
import { CreateSessionInput } from "../session/session.schema";
import { CreateUserInput, GetUserDetailsByIdInput } from "./user.schema";
export async function createUser(input: CreateUserInput) {
  const user = await UserModel.findFirst({
    where: { email: input.email },
  });
  if (user) {
    return {
      isExist: true,
      user,
    };
  }
  const newUser = await UserModel.create({
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
  return UserModel.comparePassword(input);
}

export async function findUser(input: GetUserDetailsByIdInput) {
  const userDetails = UserModel.findFirst({
    where: { id: input.userId },
    include: { profile: true },
  });
  return userDetails;
}
