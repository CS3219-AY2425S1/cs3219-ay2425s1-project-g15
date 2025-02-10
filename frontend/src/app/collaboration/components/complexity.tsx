const ComplexityPill = ({ complexity }: { complexity: string }) => {
  if (!!complexity) {
    return <span className="bg-yellow-500 text-black py-1 px-2 rounded-full text-xs">{complexity}</span>
  }
  return complexity;
}

export default ComplexityPill;