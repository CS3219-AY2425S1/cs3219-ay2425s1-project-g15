import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeSnippetHighlight = () => {
  const code = `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        idxDict = {}
        for i, num in enumerate(nums):
            idxDict[num] = i
        
        for i, num in enumerate(nums):
            diff = target - num
            if diff in idxDict and i != idxDict[diff]:
                return [i, idxDict[diff]]`;
  return (
    <SyntaxHighlighter
      language="python"
      style={darcula}
      showLineNumbers={true}
      wrapLines={true}
      lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
      customStyle={{
        height: "50%",
        borderRadius: "10px",
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeSnippetHighlight;
