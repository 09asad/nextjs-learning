import { NextRequest } from "next/server";

import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

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

export async function GET() {
  const users = await prisma.users.findMany();

  return Response.json(users);
}