import Image from "next/image";

const UndoIcon = () => {
  const iconSize = 24;
  return (
    <div className="inline-block">
      <Image
        alt="Undo Icon"
        src="/undo.svg"
        width={iconSize}
        height={iconSize}
      />
    </div>
  );
};

export default UndoIcon;
