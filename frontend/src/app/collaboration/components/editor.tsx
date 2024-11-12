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
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";

type Props = {
  room: string;
  language: string;
  code: string;
  setLanguage: (lang: string) => void;
};

function Collaboration({ room, language, code, setLanguage }: Readonly<Props>) {
  const editorRef = useRef<any>(null); // Ref to store the editor instance
  const docRef = useRef(new Y.Doc()); // Initialize a single YJS document
  const providerRef = useRef<WebrtcProvider | null>(null); // Ref to store the provider instance
  const [username, setUsername] = useState<string | null>(null);
  const [selectionRange, setSelectionRange] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editorTheme, setEditorTheme] = useState("dark-plus");

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
      const signalingServer = ["ws://34.135.245.0:32624"];
      providerRef.current = new WebrtcProvider(room, docRef.current, {
        signaling: signalingServer,
        peerOpts: {
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              {
                urls: "turn:global.relay.metered.ca:80",
                username: "2b012e1176eda910d0c8a755",
                credential: "6KjvgYahJZ21gdAp",
              },
              {
                urls: "turn:global.relay.metered.ca:80?transport=tcp",
                username: "2b012e1176eda910d0c8a755",
                credential: "6KjvgYahJZ21gdAp",
              }
            ]
          }
        }
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

  async function initializeShiki(monaco: any, editor: any) {
    const highlighter = await createHighlighter({
      themes: ["dark-plus", "light-plus"],
      langs: ["javascript", "python"],
    });

    monaco.languages.register({ id: "python" });
    monaco.languages.register({ id: "javascript" });

    shikiToMonaco(highlighter, monaco);
  }

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

    initializeShiki(monaco, editor);
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
        backgroundColor: editorTheme === "dark-plus" ? "#1e1e1e" : "white",
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
      <Toolbar
        editor={editorRef.current}
        language={language}
        setLanguage={setLanguage}
        theme={editorTheme}
        setTheme={setEditorTheme}
        saving={saving}
      />
      <div className="w-full h-[1px] mx-auto my-2"></div>
      <Editor
        height="65vh"
        width="full"
        language={language}
        theme={editorTheme}
        defaultValue="// start collaborating here!"
        onMount={handleEditorDidMount}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
        }}
      />
      <div className="w-full bg-editor">
        {providerRef.current && <VideoCall provider={providerRef.current} />}
      </div>
    </div>
  );
}

export default Collaboration;
