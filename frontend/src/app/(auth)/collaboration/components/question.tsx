import { fetchSingleLeetcodeQuestion } from "@/api/leetcode-dashboard";
import { NewQuestionData } from "@/types/find-match";
import { useEffect, useRef, useState } from "react";
import ComplexityPill from "./complexity";
import Pill from "./pill";
import { fetchSession } from "@/api/collaboration";
import { getBaseUserData } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Client as StompClient } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const CHAT_SOCKET_URL =
  process.env["NEXT_PUBLIC_CHAT_SERVICE_WEBSOCKET"] ||
  "http://localhost:3007/chat-websocket";

const Question = ({ collabid }: { collabid: string }) => {
  const [question, setQuestion] = useState<NewQuestionData | null>(null);
  const [collaborator, setCollaborator] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const stompClientRef = useRef<StompClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS(CHAT_SOCKET_URL);
    const client = new StompClient({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connection established");
        setIsConnected(true);

        // client.subscribe("/topic/chat", (message) => {
        //   console.log("Received message", message);
        // });
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
  }, []);

  const username = getBaseUserData().username;

  const handleExit = () => {
    window.location.href = "/"; // We cannot use next/router, in order to trigger beforeunload listener
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log(inputMessage);

    if (stompClientRef.current && isConnected) {
      const message = {
        message: inputMessage,
        collabID: collabid,
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
      await fetchSingleLeetcodeQuestion(data.question_id.toString()).then(
        (data) => {
          setQuestion(data);
        }
      );

      setCollaborator(data.users.filter((user) => user !== username)[0]);
    });
  }, [collabid]);

  return (
    <div className="px-12 pb-20">
      <div className="grid grid-rows-3">
        <div className="row-span-1 grid grid-rows-1 grid-cols-[75%_25%]">
          <div className="flex flex-col justify-end">
            <h1 className="text-yellow-500 text-4xl font-bold pb-2">
              {question?.title}
            </h1>
            <span className="flex flex-wrap gap-1.5 my-1 pb-2">
              {question?.category.map((category) => (
                <Pill key={category} text={category} />
              ))}
              <ComplexityPill complexity={question?.complexity || ""} />
            </span>
            <h2 className="text-grey-300 text-s pt-3 leading-[0]">
              Your collaborator: {collaborator}
            </h2>
          </div>
          <Button
            className="self-end"
            variant="destructive"
            onClick={handleExit}
          >
            Exit Room
          </Button>
        </div>
        <p className="text-white py-8 text-md">{question?.description}</p>
        <form>
          <input
            name="inputMessage"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <Button onClick={handleClick} type="submit">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Question;