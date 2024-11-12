"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Question from "../components/question";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

// Disable SSR for this component
const Collaboration = dynamic(() => import("../components/editor"), {
  ssr: false,
});

export default function CollaborationPage() {
  const { room } = useParams() as { room: string };
  const [language, setLanguage] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      const langParam = decodeURIComponent(url.split("?")[1].split("=")[1]);
      setLanguage(langParam);
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
        <Question collabid={room} />
      </Panel>
      <PanelResizeHandle />
      <Panel defaultSize={55} minSize={35}>
        <Collaboration room={room} language={language} />
      </Panel>
    </PanelGroup>
  );
}
