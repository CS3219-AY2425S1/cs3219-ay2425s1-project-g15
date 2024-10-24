import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

function Collaboration({ room }) {
    const editorRef = useRef(null); // create a ref to the editor
    const docRef = useRef(null); // store the YJS document reference

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;

        // Initialize YJS document and provider
        const doc = new Y.Doc();
        const signalingServer = ['ws://localhost:4444'];
        docRef.current = doc; // Store the document reference

        const provider = new WebrtcProvider(room, doc, { signaling: signalingServer });
        const type = doc.getText("monaco");

        // Bind YJS text to Monaco editor
        new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);

        // Observe changes in the YJS document and log its state
        type.observe((event) => {
            console.log("YJS Document updated:", type.toString());
        });
    }

    return (
        <Editor
            height="100vh"
            width="100vw"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue="// start collaborating here!"
            onMount={handleEditorDidMount}
        />
    );
}

export default Collaboration;