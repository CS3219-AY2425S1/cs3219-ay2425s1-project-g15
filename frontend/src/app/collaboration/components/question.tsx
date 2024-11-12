import { NewQuestionData } from "@/types/find-match";
import {
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ComplexityPill from "./complexity";
import Pill from "./pill";
import { getUser, getUserId, getUsername } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Client as StompClient } from "@stomp/stompjs";
import "react-chat-elements/dist/main.css";
import { Input, MessageList } from "react-chat-elements";
import SockJS from "sockjs-client";
import ResizeObserver from "resize-observer-polyfill";
import Swal from "sweetalert2";
import { CgProfile } from "react-icons/cg";
import { getChatlogs } from "@/api/chat";
import { ChatLog, SingleChatLogApiResponse } from "@/types/chat";
import MoonLoader from "react-spinners/MoonLoader";
import SyntaxHighlighter from "react-syntax-highlighter";

const CHAT_SOCKET_URL = process.env["NEXT_PUBLIC_CHAT_SERVICE_WEBSOCKET"] || "";

const Question = ({
  collabid,
  question,
  collaborator,
  collaboratorId,
  language,
  setLanguage,
}: {
  collabid: string;
  question: NewQuestionData | null;
  collaborator: string;
  collaboratorId: string;
  language: string;
  setLanguage: (lang: string) => void;
}) => {
  const userID = getUserId() ?? "Anonymous";
  const username = getUsername() ?? "Anonymous";
  const [inputMessage, setInputMessage] = useState<string>("");
  const stompClientRef = useRef<StompClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [collaboratorProfilePic, setCollaboratorProfilePic] =
    useState<string>("");
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [chatLogsPage, setChatLogsPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  // To determine if a language change is initiated by the user, or received from the collaborator
  const isLanguageChangeActive = useRef(false);
  const hasMoreMessages = useRef(true);
  const chatLogsListRef = useRef<HTMLDivElement | null>(null);
  const CHAT_CHUNK_SIZE = 10; // Number of chat logs to fetch at a time

  console.log(question);

  const packageMessage = (message: SingleChatLogApiResponse): ChatLog => {
    return {
      text: message.message,
      title: collaborator,
      date: new Date(message.timestamp),
      position: message.senderId === getUserId() ? "right" : "left",
      type: "text",
    };
  };

  const fetchChatLogs = async () => {
    if (isLoading || !hasMoreMessages.current) return;

    setIsLoading(true);

    const chatMetaData = {
      senderId: userID,
      senderName: username,
      recipientId: collaboratorId,
      recipientName: collaborator,
    };

    const res: ChatLog[] = await getChatlogs(
      collabid,
      chatLogsPage,
      CHAT_CHUNK_SIZE,
      chatMetaData
    );

    if (res.length === 0) {
      hasMoreMessages.current = false;
    } else {
      setChatLogs((prev) => [...res, ...prev]);
      setChatLogsPage((prev) => prev + 1);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (collaboratorId && collaborator) {
      fetchChatLogs();
    }
  }, [collaboratorId, collaborator]);

  useEffect(() => {
    const getUserProfilePic = async () => {
      const collaboratorData = await getUser(collaboratorId);
      const collaborator = collaboratorData.data.profilePictureUrl;
      setCollaboratorProfilePic(collaborator);
    };
    getUserProfilePic();
  }, [collaboratorId]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatLogsListRef.current && chatLogsListRef.current.scrollTop === 0) {
        fetchChatLogs();
      }
    };

    const chatList = chatLogsListRef.current;
    if (chatList) {
      chatList.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatList) {
        chatList.removeEventListener("scroll", handleScroll);
      }
    };
  }, [chatLogsPage, chatLogs]); // Depend on `chatLogsPage` to update the event when the page changes

  useEffect(() => {
    const socket = new SockJS(`${CHAT_SOCKET_URL}?senderId=${userID}`);
    const client = new StompClient({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connection established");
        setIsConnected(true);

        client.subscribe("/user/queue/chat", (message) => {
          const newMessage: SingleChatLogApiResponse = JSON.parse(message.body);
          const packagedMessage = packageMessage(newMessage);
          setChatLogs((prev: ChatLog[]) => [...prev, packagedMessage]);
        });

        client.subscribe("/user/queue/language", (message) => {
          const messageReceived: SingleChatLogApiResponse = JSON.parse(
            message.body
          );
          isLanguageChangeActive.current = false;
          setLanguage(messageReceived.message);
          Swal.fire({
            title: "Language changed by your collaborator!",
            icon: "success",
          });
        });
      },
      onDisconnect: () => {
        console.log("STOMP connection lost");
        setIsConnected(false);
      },
      onStompError: (error) => {
        console.log("STOMP error", error);
      },
    });
    stompClientRef.current = client;

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userID, collaborator, setLanguage]);

  const handleExit = () => {
    window.location.href = "/dashboard"; // We cannot use next/router, in order to trigger beforeunload listener
  };

  useEffect(() => {
    if (chatLogsListRef.current) {
      chatLogsListRef.current.scrollTop = chatLogsListRef.current.scrollHeight;
    }
  }, [chatLogs]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent
  ) => {
    e.preventDefault();
    if (!inputMessage) return;
    console.log(inputMessage);

    if (stompClientRef.current && isConnected) {
      const message = {
        message: inputMessage,
        collabId: collabid,
        recipientId: collaboratorId,
      };
      stompClientRef.current.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(message),
      });
      setInputMessage("");
    } else {
      console.error("STOMP client not connected");
    }
  };

  useEffect(() => {
    if (
      stompClientRef.current?.connected &&
      isConnected &&
      isLanguageChangeActive.current
    ) {
      const message = {
        message: language,
        collabID: collabid,
        targetID: collaboratorId,
      };
      stompClientRef.current.publish({
        destination: "/app/sendLanguageChange",
        body: JSON.stringify(message),
      });
      Swal.fire({
        title: "You have initiated a language change!",
        icon: "success",
      });
    } else {
      isLanguageChangeActive.current = true;
    }
  }, [language]);

  const questionCategories = useMemo(() => {
    return question?.category || [];
  }, [question?.category]);

  useEffect(() => {
    const container = containerRef.current;

    const calculateVisibleCategories = () => {
      if (container) {
        const containerWidth = container.clientWidth;
        let totalWidth = 200;
        const visible = [];

        for (const category of questionCategories) {
          const testElement = document.createElement("span");
          testElement.style.visibility = "hidden";
          testElement.style.position = "absolute";
          testElement.className =
            "bg-primary-900 text-grey-300 py-1 px-2 rounded-full text-xs";
          testElement.innerText = category;
          document.body.appendChild(testElement);

          const elementWidth = testElement.clientWidth;
          document.body.removeChild(testElement);

          if (totalWidth + elementWidth < containerWidth) {
            totalWidth += elementWidth;
            visible.push(category);
          } else {
            break;
          }
        }

        setVisibleCategories(visible);
      }
    };

    const observer = new ResizeObserver(calculateVisibleCategories);
    if (container) {
      observer.observe(container);
    }

    calculateVisibleCategories();

    window.addEventListener("resize", calculateVisibleCategories);

    return () => {
      window.removeEventListener("resize", calculateVisibleCategories);
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [questionCategories]);

  const remainingCategories = questionCategories.slice(
    visibleCategories.length
  );

  return (
    <div className="px-2 grid grid-rows-[20%_45%_35%] gap-2 grid-cols-1 h-full items-start max-h-[100vh]">
      <div className="mt-4 row-span-1 grid grid-rows-1 grid-cols-[75%_25%] w-full h-full">
        <div className="flex flex-col" ref={containerRef}>
          <h1
            className="text-yellow-500 text-xl font-bold pb-2 truncate"
            title={question?.title}
          >
            {question?.title}
          </h1>
          <span className="flex flex-wrap gap-1.5 my-1 pb-2">
            {visibleCategories.map((category) => (
              <Pill key={category} text={category} />
            ))}
            {remainingCategories.length > 0 && (
              <div
                key="more"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="bg-primary-900 text-grey-300 py-1 px-2 rounded-full text-xs relative"
              >
                <Pill text={`+${remainingCategories.length} more`} />
                {showTooltip && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#333",
                      color: "#fff",
                      padding: "5px",
                      borderRadius: "5px",
                      whiteSpace: "nowrap",
                      zIndex: 1000,
                    }}
                  >
                    {remainingCategories.join(", ")}
                  </div>
                )}
              </div>
            )}
            <ComplexityPill complexity={question?.complexity || ""} />
          </span>
          <h2 className="text-grey-300 text-s leading-[0] flex flex-row gap-1 items-center">
            Your collaborator:
            {collaboratorProfilePic ? (
              <img
                src={collaboratorProfilePic}
                alt="Collaborator profile pic"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <CgProfile size={25} />
            )}
            {collaborator}
          </h2>
        </div>
        <Button
          className="mt-10 w-36 justify-self-end"
          variant="destructive"
          onClick={handleExit}
        >
          Exit Room
        </Button>
      </div>
      <span className="row-span-1 text-primary-300 text-md max-h-[100%] h-full overflow-y-auto flex flex-col gap-2 bg-primary-800 p-3  rounded-md">
        <span className="text-yellow-500 font-bold text-md">
          Question Description
        </span>
        <span className="text-white py-2 text-xs">{question?.description}</span>
        <span className="text-yellow-500 font-bold text-md">Examples</span>
        {question?.examples?.map((example, idx) => (
          <div key={idx}>
            <div className="font-bold underline text-xs">
              Example {example.example_num}:
            </div>
            <div>
              <span className="font-bold text-xs">Expected Input: </span>
              <span className="text-primary-400 tracking-wide text-xs">
                {example.expected_input}
              </span>
            </div>
            <div>
              <span className="font-bold text-xs">Expected Output: </span>
              <span className="text-primary-400 tracking-wide text-xs">
                {example.expected_output}
              </span>
            </div>
            <span className="font-bold text-xs">Explanation: </span>
            <span className="text-primary-400 tracking-wide text-xs">
              {example.explanation}
            </span>
            <br />
            <br />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => setShowAnswer((prev) => !prev)}
          className="mb-3"
        >
          {showAnswer ? "Hide" : "Show"} Answer
          {showAnswer ? " ▲" : " ▼"}
        </Button>
        {showAnswer && question?.solution && (
          <div className="h-[50px] text-sm">
            <span className="text-xs italic">
              We currently only support JavaScript. Sorry!
            </span>
            <SyntaxHighlighter language="javascript" class="text-xs">
              {question?.solution}
            </SyntaxHighlighter>
          </div>
        )}
      </span>
      <div className="row-span-1 flex flex-col bg-primary-800 rounded-md h-full max-h-[90%] overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center p-2">
            <MoonLoader size={20} />
          </div>
        )}
        {chatLogs.length === 0 ? (
          <span className="h-full w-full flex items-center justify-center text-primary-300 italic">
            Say hello to your match!
          </span>
        ) : (
          <MessageList
            referance={(el: HTMLDivElement | null) => {
              chatLogsListRef.current = el as unknown as HTMLDivElement;
            }}
            className="overflow-y-auto h-full max-h-full pt-3"
            lockable={true}
            // @ts-expect-error: Suppressing type mismatch for MessageList dataSource temporarily
            dataSource={chatLogs}
          />
        )}
        <Input
          placeholder="Type here..."
          className="self-end"
          value={inputMessage}
          rightButtons={<Button onClick={handleClick}>Send</Button>}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setInputMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick(e);
            }
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({} as any)}
        />
      </div>
    </div>
  );
};

export default Question;
