/* eslint-disable react/no-unescaped-entities */
"use client";

import { getUser } from "@/api/user";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import Link from "next/link";

// no need login
const ProfilePage = () => {
  const params = useParams();
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    const { id } = params as { id: string };
    getUser(id as string).then((res) => {
      setUser(res.data);
    });
  }, [params]);

  const calculateAge = (createdAt: string | undefined) => {
    if (!createdAt) return;
    const birthDate = new Date(createdAt);
    const ageDiff = new Date().getTime() - birthDate.getTime();
    const age = Math.floor(ageDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return age;
  };

  return (
    <div className="mx-auto max-w-3xl my-10 p-4">
      <h1 className="text-white font-extrabold text-h1">{user?.username}'s Profile!</h1>
      <div className="flex flex-col gap-y-4 mt-4">
        <h2 className="text-yellow-500 font-bold text-h3">Profile Age</h2>
        <span className="text-white font-light text-lg">{calculateAge(user?.createdAt)} days</span>

        <h2 className="text-yellow-500 font-bold text-h3">Email</h2>
        <span className="text-white font-light text-lg">{user?.email}</span>

        <h2 className="text-yellow-500 font-bold text-h3">Bio</h2>
        {user?.bio && <span className="text-white font-light text-lg">{user?.bio}</span>}

        <h2 className="text-yellow-500 font-bold text-h3">GitHub</h2>
        {user?.github && <Link href={user?.github} className="text-white font-light text-lg underline hover:text-yellow-500">{user?.github}</Link>}

        <h2 className="text-yellow-500 font-bold text-h3">LinkedIn</h2>
        {user?.linkedin && <Link href={user?.linkedin} className="text-white font-light text-lg underline hover:text-yellow-500">{user?.linkedin}</Link>}
      </div>
    </div>
  );
}

export default ProfilePage;