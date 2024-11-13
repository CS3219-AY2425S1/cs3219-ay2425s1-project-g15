import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

const ProfileItem = ({ name, img, linkedin, github }: { name: string, img: string, linkedin: string, github: string }) => {
  return (
    <div className="mx-auto max-w-6xl w-64">
      <h1 className="text-yellow-500 text-xl text-center">{name}</h1>
      <img src={img} className="w-40 rounded-xl mx-auto my-2"/>
      <div className="grid">
        <div className="flex mx-auto gap-2">
          <Link href={linkedin} className="text-blue-500 hover:underline text-white hover:text-yellow-500">
            <FaLinkedin size={30}/>
          </Link>
          <Link href={github} className="text-blue-500 hover:underline text-white hover:text-yellow-500">
            <FaGithub size={30}/>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfileItem;