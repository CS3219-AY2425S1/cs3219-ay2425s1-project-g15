import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const iconSize = 180;
  return (
    <div className="w-full">
      <Link href="/">
        <Image
          alt="PeerPrep Header Icon"
          src="logo_full.svg"
          width={iconSize}
          height={iconSize}
        />
      </Link>
    </div>
  );
};

export default Header;
