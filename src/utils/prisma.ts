import { PrismaClient } from "@prisma/client";
import Users from "../models/user";

const prisma = new PrismaClient();

export const UserModel = Users(prisma.user);
export const PostModel = prisma.post;
export const VoteModel = prisma.votes;
export const AttachmentModel = prisma.attachments;
export default prisma;
