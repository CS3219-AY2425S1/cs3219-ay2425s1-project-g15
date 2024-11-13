/* eslint-disable react/no-unescaped-entities */
"use client";

import { getUser } from "@/api/user";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import Link from "next/link";
import VerificationSymbol from "@/app/common/VerificationSymbol";

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
    <div className="mx-auto max-w-xl my-10 p-4">
      <h1 className="text-white font-extrabold text-h1">{user?.username}'s Profile!</h1>
      <div className="flex flex-col gap-y-4 mt-4">
        <img src={user?.profilePictureUrl} alt="Profile Picture" className="w-32 h-32 rounded-full mx-auto" />

        <div className="grid grid-cols-2 my-2 gap-2">
          <h2 className="text-yellow-500 font-bold text-lg">PROFILE AGE</h2>
          <span className="text-white font-light text-lg">{calculateAge(user?.createdAt)} days</span>
        </div>

        <div className="grid grid-cols-2 my-2 gap-2">
          <h2 className="text-yellow-500 font-bold text-lg">EMAIL</h2>
          <div className="flex gap-2">
            <p className="text-white my-auto text-lg">{user?.email} </p>
            <VerificationSymbol isVerified={user?.isVerified || false}/>
          </div>
        </div>

        <div className="grid grid-cols-2 my-2 gap-2">
          <h2 className="text-yellow-500 font-bold text-lg">BIO</h2>
          {user?.bio && <span className="text-white font-light text-lg">{user?.bio}</span>}
        </div>

        <div className="grid grid-cols-2 my-2 gap-2">
          <h2 className="text-yellow-500 font-bold text-lg">GITHUB URL</h2>
          {user?.github && <Link href={user?.github} className="text-white font-light text-lg underline hover:text-yellow-500">{user?.github}</Link>}
        </div>

        <div className="grid grid-cols-2 my-2 gap-2">
          <h2 className="text-yellow-500 font-bold text-lg">LINKEDIN URL</h2>
          {user?.linkedin && <Link href={user?.linkedin} className="text-white font-light text-lg underline hover:text-yellow-500">{user?.linkedin}</Link>}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;