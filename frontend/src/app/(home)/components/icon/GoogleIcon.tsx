import Image from "next/image";
import Link from "next/link";

const GoogleIcon = () => {
  const iconSize = 24;
  return (
    <div className="inline-block">
      <Link href="/">
        <Image
          alt="Google Icon"
          src="google_icon.svg"
          width={iconSize}
          height={iconSize}
        />
      </Link>
    </div>
  );
};

export default GoogleIcon;
