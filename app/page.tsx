import axios from "axios";

async function getUserData() {
  const res = await axios.get("http://localhost:3000/api/user");
  return res.data;
}

export default async function Home() {
  const userDetails = await getUserData();

  return (
    <div className="flex flex-wrap gap-4 p-8">
      {userDetails.map((user: any) => (
        <div
          key={user.id}
          className="border p-8 rounded w-64"
        >
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
        </div>
      ))}
    </div>
  );
}