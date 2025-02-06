import prisma from "@/prisma/utils/db";

export const getServerSession = async (token?: string) => {
  if (!token) return null;

  const session = await prisma.session.findFirst({
    where: { sessionToken: token },
    select: {
      user: {
        select: {
          name: true,
          image: true,
          login: true,
          id: true,
          Permission: true,
        },
      },
    },
  });

  return session;
};
