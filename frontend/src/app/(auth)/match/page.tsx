"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QuestionDifficulty,
  QuestionLanguages,
  QuestionTopics,
} from "@/types/find-match";
import { capitalizeWords } from "@/utils/string_utils";
import { useForm } from "react-hook-form";
import { Client as StompClient } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { send } from "process";
import FindPeerHeader from "@/app/(auth)/components/match/FindPeerHeader";
import { preferredLanguagesList, topicsList } from "@/utils/constants";
import Swal from "sweetalert2";

interface FindMatchFormOutput {
  questionDifficulty: string;
  preferredLanguages: string;
  questionTopics: string[];
}

interface FindMatchSocketMessage {
  userEmail: string;
  topics: string[];
  programmingLanguage: string[];
  difficulty: string;
}

const showLoadingSpinner = () => {
  Swal.fire({
    title: "Processing...",
    text: "Finding a match...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

const closeLoadingSpinner = () => {
  Swal.close();
};

const SOCKET_URL =
  process.env["NEXT_PUBLIC_MATCHING_SERVICE_WEBSOCKET"] ||
  "http://localhost:3002/matching-websocket";

const CURRENT_USER = uuidv4(); // TODO: Replace after merging Hafeez' new authentication PR

const TIMEOUT_TIMER = 2; // in seconds

const FindPeer = () => {
  const stompClientRef = useRef<StompClient | null>(null); // Use useRef to store client instance
  const [isConnected, setIsConnected] = useState(false);
  const [socketMessages, setSocketMessages] = useState<string[]>([]);

  const makeSocketConnection = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS(SOCKET_URL);
      const client = new StompClient({
        webSocketFactory: () => socket,
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("STOMP connection established");
          setIsConnected(true);

          // Subscribe to a topic
          client.subscribe("/user/queue/matches", (message) => {
            console.log("Received message: ", message.body);
            setSocketMessages((prevMessages) => [
              ...prevMessages,
              message.body,
            ]);
          });

          stompClientRef.current = client; // Store the client in the ref
          resolve();
        },
        onDisconnect: () => {
          console.log("STOMP connection closed");
        },
        onStompError: (error) => {
          console.error("STOMP error: ", error);
          reject(error);
        },
      });

      client.activate();
    });
  };

  const sendMatchRequest = async (userFilter: FindMatchFormOutput) => {
    if (stompClientRef.current == null || !isConnected) {
      console.log("STOMP client not connected. Attempting to connect...");
      await makeSocketConnection();
    }

    // Repackage user filter data
    const userMatchRequest: FindMatchSocketMessage = {
      userEmail: CURRENT_USER,
      topics: userFilter.questionTopics,
      programmingLanguage: userFilter.preferredLanguages,
      difficulty: userFilter.questionDifficulty,
    };

    console.log("Sending match request with data: ", userMatchRequest);

    const client = stompClientRef.current; // Use the ref to get the client instance

    if (client?.connected !== true) {
      console.error(
        "STOMP client is not connected. Connection error encountered."
      );
      return;
    }

    client.publish({
      destination: "/app/matchRequest",
      body: JSON.stringify(userMatchRequest),
    });
    console.log("Match request sent: ", CURRENT_USER);

    showLoadingSpinner();

    const timeout = setTimeout(() => {
      stompClientRef.current?.deactivate();
      Swal.update({
        title: "Timeout",
        text: "We could not find a match for you. Perhaps try a new set of filters? :(",
        icon: "error",
        showCloseButton: true,
      });
    }, TIMEOUT_TIMER * 1000);

    try {
      client.subscribe("/user/queue/matches", (message) => {
        console.log("Received message: ", message.body);
        closeLoadingSpinner();
        clearTimeout(timeout);
        Swal.fire(
          "Match Found!",
          `We found a match for you! You have been matched with ${message.body}.`,
          "success"
        );
      });
    } catch (error) {
      console.error("Error subscribing to /user/queue/matches: ", error);
      closeLoadingSpinner();
      clearTimeout(timeout);

      Swal.fire(
        "Error",
        "An error occurred while trying to find a match for you. Please try again later.",
        "error"
      );
    }
  };

  const form = useForm({
    defaultValues: {
      questionDifficulty: QuestionDifficulty.MEDIUM.valueOf(),
      preferredLanguages: QuestionLanguages.PYTHON.valueOf(),
      questionTopics: "",
    },
  });

  const onSubmit = (data: FindMatchFormOutput) => {
    sendMatchRequest(data);
  };

  return (
    <Container>
      <FindPeerHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[1fr_8fr] grid-rows-3 mt-5 mb-14 gap-y-10">
            <span className="text-sm text-primary-400 self-center">
              Difficulty
            </span>
            <Select
              name="questionDifficulty"
              defaultValue={QuestionDifficulty.MEDIUM.valueOf()}
            >
              <SelectTrigger className="w-full bg-primary-800 text-white">
                <SelectValue placeholder="Choose a difficulty..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QuestionDifficulty).map((qd) => (
                  <SelectItem value={qd} key={qd}>
                    <span className="capitalize">{qd}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-primary-400">
              Preferred Languages
            </span>
            <FormField
              control={form.control}
              name="preferredLanguages"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      options={preferredLanguagesList}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <span className="text-sm text-primary-400">Topics</span>
            <FormField
              control={form.control}
              name="questionTopics"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      options={topicsList}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="pl-10 pr-10">
            Find Interview Peer
          </Button>
        </form>
      </Form>
    </Container>
  );
};

export default FindPeer;
