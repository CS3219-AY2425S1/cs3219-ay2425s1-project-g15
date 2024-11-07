/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { getUser } from "@/api/user";
import { Cursors } from "./cursors";
import { Toolbar } from "./toolbar";
import { updateSession } from "@/api/collaboration";
import VideoCall from "./video";

type Props = {
  room: string;
  language: string;
  code: string;
};

function Collaboration({ room, language, code }: Readonly<Props>) {
  const editorRef = useRef<any>(null); // Ref to store the editor instance
  const docRef = useRef(new Y.Doc()); // Initialize a single YJS document
  const providerRef = useRef<WebrtcProvider | null>(null); // Ref to store the provider instance
  const [username, setUsername] = useState<string | null>(null);
  const [selectionRange, setSelectionRange] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch username on component mount
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = await getUser();
        setUsername(user.data.username);
      } catch (err) {
        console.error("Failed to fetch username:", err);
        setUsername("Anonymous");
      }
    };
    fetchUsername();
  }, []);

  // Initialize WebRTC provider once per room
  useEffect(() => {
    if (!providerRef.current) {
      //const signalingServer = ["ws://localhost:4444"];
      const signalingServer = [
        "wss://signaling-598285527681.us-central1.run.app",
      ];
      providerRef.current = new WebrtcProvider(room, docRef.current, {
        signaling: signalingServer,
      });

      // Cleanup provider on component unmount or when room changes
      return () => {
        if (providerRef.current) {
          providerRef.current.destroy();
        }
        providerRef.current = null;
      };
    }
  }, [room]);

  const saveSession = useCallback(async () => {
    if (docRef.current) {
      setSaving(true);
      const serializedDoc = Buffer.from(
        Y.encodeStateAsUpdate(docRef.current)
      ).toString("base64");
      await updateSession(room, serializedDoc);
      setTimeout(() => setSaving(false), 2000);
    }
  }, [room]);

  useEffect(() => {
    try {
      if (code) {
        const update = Uint8Array.from(Buffer.from(code, "base64"));
        Y.applyUpdate(docRef.current, update);
      }
    } catch (err) {
      console.error(err);
    }
  }, [code]);

  function handleEditorDidMount(
    editor: { onDidChangeCursorPosition: (arg0: (e: any) => void) => void },
    monaco: any
  ) {
    editorRef.current = editor;

    if (providerRef.current && docRef.current) {
      const type = docRef.current.getText("monaco");

      // Bind YJS text to Monaco editor
      new MonacoBinding(
        type,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        providerRef.current.awareness
      );
    }

    editor.onDidChangeCursorPosition(() => {
      const selection = editorRef.current.getSelection();
      if (selection) {
        setSelectionRange(selection);
      }
    });
  }

  // Save session before page unload
  useEffect(() => {
    const handleBeforeUnload = async (e: {
      preventDefault: () => void;
      returnValue: string;
    }) => {
      e.preventDefault();
      await saveSession();
      e.returnValue = ""; // Chrome requires returnValue to be set
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [room, saveSession]);

  // Automatically save session every minute
  useEffect(() => {
    const intervalId = setInterval(saveSession, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [saveSession]);

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#d4d4d4",
        height: "100vh",
        width: "full",
      }}
    >
      {providerRef.current && username ? (
        <Cursors
          yProvider={providerRef.current}
          username={username}
          cursorPosition={selectionRange ?? {}}
        />
      ) : null}
      <Toolbar editor={editorRef.current} language={language} saving={saving} />
      <div className="w-full h-[1px] bg-primary-1000 mx-auto my-2"></div>
      <Editor
        height="65vh"
        width="full"
        theme="vs-dark"
        defaultLanguage={language}
        defaultValue="// start collaborating here!"
        onMount={handleEditorDidMount}
        options={{ wordWrap: "on" }}
      />
      <div className="w-full bg-editor">
        {providerRef.current && <VideoCall provider={providerRef.current} />}
      </div>
    </div>
  );
}

export default Collaboration;
