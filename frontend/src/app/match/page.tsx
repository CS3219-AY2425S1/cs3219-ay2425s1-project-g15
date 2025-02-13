"use client";

import { getUsername, getToken, getUserId } from "@/api/user";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multiselect";
import { useForm } from "react-hook-form";
import { Client as StompClient } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRef, useState, useEffect } from "react";
import FindPeerHeader from "@/app/match/components/FindPeerHeader";
import {
  preferredLanguagesList,
  questionDifficulties,
  topicsList,
} from "@/utils/constants";
import Swal from "sweetalert2";
import { checkSession, createSession } from "@/api/collaboration";
// import { createRoot } from "react-dom/client";

interface FindMatchFormOutput {
  questionDifficulties: string[];
  preferredLanguages: string[];
  questionTopics: string[];
}

interface FindMatchSocketMessage {
  userEmail: string;
  userId: string;
  topics: string[];
  programmingLanguages: string[];
  difficulties: string[];
}

interface FindMatchSocketMessageResponse {
  matchedUserEmail: string;
  matchedUserId: string;
  collaborationId: string;
  questionId: number;
  language: string;
}

const TIMEOUT_TIMER = 30; // in seconds

const showLoadingSpinner = (onCancel: () => void) => {
  Swal.fire({
    title: "Finding a match...",
    html: `
      <div> You have waited for <div><div id="timer"></div></div> seconds...</div>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    cancelButtonText: "Cancel",
    showConfirmButton: false,
    timer: TIMEOUT_TIMER * 1000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup()!.querySelector("#timer");
      setInterval(() => {
        timer!.textContent = `${
          TIMEOUT_TIMER - Math.ceil((Swal.getTimerLeft() || 0) / 1000)
        }`;
      }, 100);
    },
  }).then((result) => {
    // Handle cancel button click
    if (result.dismiss === Swal.DismissReason.cancel) {
      onCancel();
    }
  });
};

const closeLoadingSpinner = () => {
  Swal.close();
};

const SOCKET_URL = "http://localhost:3005/matching-websocket";

const CURRENT_USERNAME = getUsername(); // Username is unique
const CURRENT_USERID = getUserId(); // UserId is unique

const FindPeer = () => {
  const stompClientRef = useRef<StompClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socketMessages, setSocketMessages] = useState<string[]>([]);

  const cancelSocketConnection = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      console.log("WebSocket connection canceled by user.");
    }
    closeLoadingSpinner();
  };

  const makeSocketConnection = (): Promise<void> => {
    const timeout = setTimeout(() => {
      const client = stompClientRef.current;
      client?.deactivate();
      Swal.fire({
        title: "Timeout",
        text: "We could not find a match for you, try a new set of filters? :(",
        icon: "error",
        showCloseButton: true,
      });
    }, TIMEOUT_TIMER * 1000);

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

          client.subscribe("/user/queue/matches", (message) => {
            try {
              console.log("Received message: ", message.body);
              setSocketMessages((prevMessages) => [
                ...prevMessages,
                message.body,
              ]);
              console.log("Received message: ", message.body);
              const response: FindMatchSocketMessageResponse = JSON.parse(
                message.body
              );
              const matchedUsername = response.matchedUserEmail;
              const matchedUserId = response.matchedUserId;
              const collaborationId = response.collaborationId;
              const questionId = response.questionId;
              const language = response.language;
              closeLoadingSpinner();
              clearTimeout(timeout);
              Swal.fire(
                "Match Found!",
                `We found a match for you! You have been matched with ${matchedUsername}.`,
                "success"
              ).then(async () => {
                Swal.fire({
                  title: "Redirecting...",
                  text: "Please wait while we redirect you to the collaboration page.",
                  allowOutsideClick: false,
                  showConfirmButton: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
                // Create a session in the collaboration service
                try {
                  const sessionExists = await checkSession(collaborationId);
                  if (!sessionExists.exists) {
                    await createSession({
                      collabid: collaborationId,
                      users: [CURRENT_USERID!, matchedUserId],
                      question_id: questionId,
                      language: language,
                    });
                  }
                } catch (error) {
                  console.error(error);
                }

                // Pass language as a query parameter to the collaboration page
                window.location.href = `/collaboration/${collaborationId}`;
              });
              client.deactivate();
            } catch (error) {
              console.error(
                "Error subscribing to /user/queue/matches: ",
                error
              );
              closeLoadingSpinner();
              clearTimeout(timeout);

              Swal.fire(
                "Error",
                "An error occurred while trying to find a match for you. Please try again later.",
                "error"
              );
              client.deactivate();
            }
          });

          client.subscribe("/user/queue/requestRejection", (message) => {
            try {
              console.log("Received message: ", message.body);
              setSocketMessages((prevMessages) => [
                ...prevMessages,
                message.body,
              ]);
              const response: string = message.body;
              closeLoadingSpinner();
              clearTimeout(timeout);
              Swal.fire(
                "A new Match Request cannot be sent!",
                `${response}`,
                "error"
              );
              client.deactivate();
            } catch (error) {
              console.error(
                "Error subscribing to /user/queue/requestRejection: ",
                error
              );
              closeLoadingSpinner();
              clearTimeout(timeout);

              Swal.fire(
                "Error",
                "An error occurred while trying to find a match for you. Please try again later.",
                "error"
              );
              client.deactivate();
            }
          });

          client.subscribe("/user/queue/noQuestionExists", (message) => {
            try {
              console.log("Received message: ", message.body);
              setSocketMessages((prevMessages) => [
                ...prevMessages,
                message.body,
              ]);
              const response: string = message.body;
              closeLoadingSpinner();
              clearTimeout(timeout);
              Swal.fire(
                `${response}`,
                "Please try another set of filters, such as Easy-Python-Array",
                "error"
              );
              client.deactivate();
            } catch (error) {
              console.error(
                "Error subscribing to /user/queue/requestRejection: ",
                error
              );
              closeLoadingSpinner();
              clearTimeout(timeout);

              Swal.fire(
                "Error",
                "An error occurred while trying to find a match for you. Please try again later.",
                "error"
              );
              client.deactivate();
            }
          });

          stompClientRef.current = client;
          resolve();
        },
        onDisconnect: () => {
          console.log("STOMP connection closed");
          setIsConnected(false);
          clearTimeout(timeout);
        },
        onStompError: (error) => {
          console.error("STOMP error: ", error);
          clearTimeout(timeout);
          reject(new Error(error.headers.message));
        },
      });
      stompClientRef.current = client;
      client.activate();
    });
  };

  const checkUser = (username: string | undefined) => {
    if (!username) {
      Swal.fire(
        "Error",
        "What did you do... Why did you delete the cookie??",
        "error"
      );
      return false;
    }
  };

  const sendMatchRequest = async (userFilter: FindMatchFormOutput) => {
    checkUser(CURRENT_USERNAME);

    if (stompClientRef.current == null || !isConnected) {
      console.log("STOMP client not connected. Attempting to connect...");
      await makeSocketConnection();
    }

    // Repackage user filter data
    const userMatchRequest: FindMatchSocketMessage = {
      userEmail: CURRENT_USERNAME || "",
      userId: CURRENT_USERID || "",
      topics: userFilter.questionTopics,
      programmingLanguages: userFilter.preferredLanguages,
      difficulties: userFilter.questionDifficulties,
    };

    console.log("Sending match request with data: ", userMatchRequest);

    const client = stompClientRef.current; // Use the ref to get the client instance

    if (client?.connected !== true) {
      console.error(
        "STOMP client is not connected. Connection error encountered."
      );
      return;
    }

    checkUser(CURRENT_USERNAME);

    client.publish({
      destination: "/app/matchRequest",
      body: JSON.stringify(userMatchRequest),
    });
    console.log("Match request sent: ", CURRENT_USERNAME);

    showLoadingSpinner(cancelSocketConnection);
  };
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken() || null);
  }, []);

  const form = useForm({
    defaultValues: {
      questionDifficulties: [],
      preferredLanguages: [],
      questionTopics: [""],
    },
  });

  const onSubmit = (data: FindMatchFormOutput) => {
    if (!data.questionDifficulties.length) {
      Swal.fire(
        "Error",
        "Please select at least one difficulty level",
        "error"
      );
      return;
    } else if (!data.preferredLanguages.length) {
      Swal.fire(
        "Error",
        "Please select at least one preferred programming language",
        "error"
      );
      return;
    } else if (!data.questionTopics.length) {
      Swal.fire("Error", "Please select at least one topic", "error");
      return;
    }
    sendMatchRequest(data);
  };

  return (
    !!token && (
      <Container>
        <FindPeerHeader />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-[1fr_8fr] grid-rows-3 mt-5 mb-14 gap-y-10">
              <span className="text-sm text-primary-400 self-center">
                Difficulty
              </span>
              <FormField
                control={form.control}
                name="questionDifficulties"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelect
                        options={questionDifficulties}
                        onValueChange={field.onChange}
                        placeholder="Select options"
                        variant="inverted"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

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
    )
  );
};

export default FindPeer;
