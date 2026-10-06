"use server";

import prisma from "@/lib/prisma";

export async function signup(name: string, email: string, password: string) {
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password,
    },
  });

  return user;
}