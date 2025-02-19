import { compare } from "bcryptjs";
import { prisma } from "@/db/prisma";

export async function verifyUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.password) return null;

  const isValid = await compare(password, user.password);
  return isValid ? user : null;
}
