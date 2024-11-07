"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Question from "../components/question";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { fetchSession } from "@/api/collaboration";
import { NewQuestionData } from "@/types/find-match";
import { fetchSingleQuestion } from "@/api/question-dashboard";
import { getUsername } from "@/api/user";

// Disable SSR for this component
const Collaboration = dynamic(() => import("../components/editor"), {
  ssr: false,
});

export default function CollaborationPage() {
  const { room } = useParams() as { room: string };
  const [language, setLanguage] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [collaborator, setCollaborator] = useState<string>("");
  const [question, setQuestion] = useState<NewQuestionData | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchSession(room).then(async (data) => {
        await fetchSingleQuestion(data.question_id.toString()).then((data) => {
          setQuestion(data);
        });
        const userID = getUsername(); // Change to userID

        setCollaborator(data.users.filter((user) => user !== userID)[0]);
        setCode(data.code);
        setLanguage(data.language);
      });
    }
  }, []);

  useEffect(() => {
    if (room) {
      console.log("Joined room: ", room);
    }
  }, [room]);

  return (
    <PanelGroup direction="horizontal" autoSaveId={room}>
      <Panel defaultSize={45} minSize={35}>
        <Question
          collabid={room}
          question={question}
          collaborator={collaborator}
        />
      </Panel>
      <PanelResizeHandle />
      <Panel defaultSize={55} minSize={35}>
        <Collaboration room={room} language={language} code={code} />
      </Panel>
    </PanelGroup>
  );
}
