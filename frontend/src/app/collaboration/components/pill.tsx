const Pill = ({ text }: { text: string }) => {
  if (!!text) {
    return (
      <span className="bg-primary-900 text-grey-300 py-1 px-2 rounded-full text-xs">
        {text}
      </span>
    );
  }
  return text;
};

export default Pill;
