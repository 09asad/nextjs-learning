import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const user = await prisma.users.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });

  return Response.json({
    message: "You are signed up!",
    data: user,
  });
}
