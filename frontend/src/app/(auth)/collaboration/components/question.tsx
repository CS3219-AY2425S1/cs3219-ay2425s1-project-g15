import { fetchSingleQuestion } from "@/api/question-dashboard";
import { NewQuestionData } from "@/types/find-match";
import {
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ComplexityPill from "./complexity";
import Pill from "./pill";
import { fetchSession } from "@/api/collaboration";
import { getUsername } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Client as StompClient } from "@stomp/stompjs";
import "react-chat-elements/dist/main.css";
import { Input, MessageList } from "react-chat-elements";
import SockJS from "sockjs-client";

const CHAT_SOCKET_URL =
  process.env["NEXT_PUBLIC_CHAT_SERVICE_WEBSOCKET"] ||
  "http://localhost:3007/chat-websocket" || "http://35.192.214.143:80/chat-websocket";

interface Message {
  position: "left" | "right";
  type: "text";
  title: string;
  text: string;
}

const Question = ({ collabid }: { collabid: string }) => {
  const [question, setQuestion] = useState<NewQuestionData | null>(null);
  const [collaborator, setCollaborator] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const stompClientRef = useRef<StompClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const messageListRef = useRef<HTMLDivElement | null>(null);

  // NOTE: We use the username of the collaborator instead of the userID. This is because we cannot retrieve the collaborator's ID.
  // Thus, the backend identifies pairs of users by their username for now. However, this can introduce bugs as
  // although usernames are unique, if a user leaves the collaboration, changes their username, and comes back, the backend will not be able to identify them.
  // This is because the Session will still have the old username. Therefore, we should change this to use the userID instead.

  useEffect(() => {
    setUserID(getUsername() ?? "Anonymous"); // Change me later

    const socket = new SockJS(`${CHAT_SOCKET_URL}?userID=${userID}`); // BUG: This should NOT be username, but userID. Use this for now because we can't retrieve the collaborator's ID.
    const client = new StompClient({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connection established");
        setIsConnected(true);

        client.subscribe("/user/queue/chat", (message) => {
          const messageReceived = message.body;
          const newMessage: Message = {
            position: "left",
            type: "text",
            title: collaborator!,
            text: messageReceived,
          };
          setMessages((prev) => [...prev, newMessage]);
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
  }, [userID, collaborator]);

  const handleExit = () => {
    window.location.href = "/"; // We cannot use next/router, in order to trigger beforeunload listener
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent
  ) => {
    e.preventDefault();
    if (!inputMessage) return;
    console.log(inputMessage);
    setMessages((prev) => [
      ...prev,
      {
        position: "right" as const,
        title: userID!,
        text: inputMessage,
        type: "text",
      },
    ]);

    if (stompClientRef.current && isConnected) {
      const message = {
        message: inputMessage,
        collabID: collabid,
        targetID: collaborator, // BUG: Should be the other user's ID, not username. Temporary workaround.
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
    fetchSession(collabid).then(async (data) => {
      await fetchSingleQuestion(data.question_id.toString()).then((data) => {
        setQuestion(data);
      });

      setCollaborator(data.users.filter((user) => user !== userID)[0]);
    });
  }, [collabid, userID]);

  const questionCategories = question?.category || [];

  const firstThreeQuestionPills = questionCategories
    .slice(0, 3)
    .map((category) => <Pill key={category} text={category} />);

  const remainingCategories = questionCategories.slice(3);

  if (questionCategories.length > 3) {
    firstThreeQuestionPills.push(
      <div
        key="more"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-primary-900 text-grey-300 py-1 px-2 rounded-full text-xs relative"
      >
        <Pill text={`+${questionCategories.length - 3} more`} />
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
    );
  }

  return (
    <div className="px-12 grid grid-rows-[20%_45%_35%] gap-4 grid-cols-1 h-full items-start">
      <div className="mt-10 row-span-1 grid grid-rows-1 grid-cols-[75%_25%] w-full">
        <div className="flex flex-col">
          <h1 className="text-yellow-500 text-xl font-bold pb-2">
            {question?.title}
          </h1>
          <span className="flex flex-wrap gap-1.5 my-1 pb-2">
            {...firstThreeQuestionPills}
            <ComplexityPill complexity={question?.complexity || ""} />
          </span>
          <h2 className="text-grey-300 text-s pt-3 leading-[0]">
            Your collaborator: {collaborator}
          </h2>
        </div>
        <Button className="self-end" variant="destructive" onClick={handleExit}>
          Exit Room
        </Button>
      </div>
      <span className="row-span-1 text-primary-300 text-md max-h-[100%] h-full overflow-y-auto flex flex-col gap-2 bg-primary-800 p-3 rounded-md">
        <span className="text-yellow-500 font-bold">Question Description</span>
        <span className="text-white py-8 text-md">{question?.description}</span>
      </span>
      <div className="row-span-1 flex flex-col bg-primary-800 rounded-md h-full max-h-[80%] min-h-[80%] overflow-y-auto">
        {messages.length == 0 ? (
          <span className="h-full w-full flex items-center justify-center text-primary-300 italic">
            Say hello to your match!
          </span>
        ) : (
          <MessageList
            referance={(el: HTMLDivElement | null) => {
              messageListRef.current = el as unknown as HTMLDivElement;
            }}
            className="overflow-y-auto h-full pt-3"
            lockable={true}
            // @ts-expect-error: Suppressing type mismatch for MessageList dataSource temporarily
            dataSource={messages}
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
            console.log(e);
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
