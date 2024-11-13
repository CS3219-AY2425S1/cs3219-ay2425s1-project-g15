"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState, useRef } from "react";

const CodeSnippetHighlight = () => {
  const code = `
class Solution:
  def twoSum(self, nums: List[int], target: int) -> List[int]:
      idxDict = {}
      for i, num in enumerate(nums):
          idxDict[num] = i
      
      for i, num in enumerate(nums):
          diff = target - num
          if diff in idxDict and i != idxDict[diff]:
              return [i, idxDict[diff]]
              
              `;

  const [displayedText, setDisplayedText] = useState(""); // Store the currently displayed text
  const currentCharIndexRef = useRef(0); // Track the current character index
  const typingInterval = 30; // Milliseconds between each character

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentCharIndexRef.current < code.length) {
        // Append the next character if it exists
        const nextChar = code[currentCharIndexRef.current];
        if (nextChar !== undefined) {
          setDisplayedText((prevText) => prevText + nextChar);
          currentCharIndexRef.current += 1;
        }
      } else {
        // Stop the interval once all characters are displayed
        clearInterval(intervalId);
      }
    }, typingInterval);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <SyntaxHighlighter
      language="python"
      style={darcula}
      showLineNumbers={true}
      wrapLines={true}
      lineProps={{ style: { wordBreak: "break-all", whiteSpace: "pre-wrap" } }}
      customStyle={{
        height: "50%",
        width: "100%",
        borderRadius: "10px",
      }}
    >
        {displayedText}

    </SyntaxHighlighter>
  );
};

export default CodeSnippetHighlight;
