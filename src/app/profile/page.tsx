import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import getUserProfile from "@/libs/getUserProfile";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.token) {
    return (
      <main className="min-h-screen pt-[90px] bg-slate-50 px-6 md:px-24 flex items-center justify-center">
        <div className="text-red-500">Unable to load profile. Please sign in.</div>
      </main>
    );
  }

  const profile = await getUserProfile(session.user.token);
  const createdAt = new Date(profile.data.createdAt);

  const name = profile.data.name || "Unknown user";
  const email = profile.data.email || "No email";
  const avatar = "/img/pfp.png";

  return (
    <main className="min-h-screen pt-[90px] bg-slate-50 px-6 md:px-24">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center lg:items-start p-8 gap-8">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl font-bold mb-4">Welcome, {name}</h1>
          <div className="text-base text-gray-500 mb-3">Name: {name}</div>
          <div className="text-base text-gray-500 mb-3">Email: {email}</div>
          <div className="text-base text-gray-500 mb-3">Phone: {profile.data.telephone}</div>
          <div className="text-base text-gray-500 mb-3">Role: {profile.data.role}</div>
          <div className="text-base text-gray-500 mb-3">Member Since: {createdAt.toDateString()}</div>
        </div>

        <div className="flex-shrink-0 rounded-2xl overflow-hidden border border-gray-200">
          <Image
            src={avatar}
            alt="User profile picture"
            width={220}
            height={220}
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
