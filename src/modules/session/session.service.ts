import prisma from "../../utils/prisma";

export async function createSession(userId: string, userAgent: string) {
  const session = await prisma.session.create({
    data: {
      userId: userId,
      userAgent,
    },
  });
  return session;
}

export async function getSessionById(userId: string) {
  const session = await prisma.session.findFirst({
    where: { userId, valid: true },
    include: {
      user: true,
    },
  });
  return session;
}
