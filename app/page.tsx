import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.users.findMany();

  return (
    <div className="flex flex-wrap gap-4 p-8">
      {users.map((user) => (
        <div
          key={user.id}
          className="w-64 rounded-lg border p-8"
        >
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
        </div>
      ))}
    </div>
  );
}