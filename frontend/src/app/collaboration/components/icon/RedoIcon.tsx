import Image from "next/image";

const RedoIcon = () => {
  const iconSize = 24;
  return (
    <div className="inline-block">
      <Image
        alt="Redo Icon"
        src="/redo.svg"
        width={iconSize}
        height={iconSize}
      />
    </div>
  );
};

export default RedoIcon;
