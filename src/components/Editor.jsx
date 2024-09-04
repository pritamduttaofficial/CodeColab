import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { initializeSocketConnection } from "../socket";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function Editor({ setClients, setHost }) {
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const codeMirrorRef = useRef(null);
  const socketRef = useRef(null);
  const isUpdatingFromSocketRef = useRef(false); // Ref to track if change is from socket

  // Effect handling socket connection
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initializeSocketConnection();

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("socket error: ", err);
        toast.error("Socket connection failed!");
        navigate("/");
      };

      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on("joined", ({ clients, host, username }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        setHost(host);
      });

      // Listening for disconnected
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });

      // Listening for code updates from the server
      socketRef.current.on("code_change", ({ code }) => {
        if (codeMirrorRef.current && !isUpdatingFromSocketRef.current) {
          isUpdatingFromSocketRef.current = true; // Prevent sending another event

          // Replace the entire document with the new code
          codeMirrorRef.current.dispatch({
            changes: {
              from: 0,
              to: codeMirrorRef.current.state.doc.length,
              insert: code,
            },
          });

          isUpdatingFromSocketRef.current = false; // Allow updates to trigger events again
        }
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("joined");
        socketRef.current.off("disconnected");
        socketRef.current.off("code_change");
      }
    };
  }, []);

  // Effect handling CodeMirror setup
  useEffect(() => {
    if (editorRef.current) {
      const startState = EditorState.create({
        doc: "// Start coding here...",
        extensions: [
          basicSetup,
          javascript(),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.changes && !isUpdatingFromSocketRef.current) {
              const code = update.state.doc.toString();
              socketRef.current.emit("code_change", {
                roomId,
                code,
              });
            }
          }),
        ],
      });

      const view = new EditorView({
        state: startState,
        parent: editorRef.current,
      });

      codeMirrorRef.current = view;

      return () => view.destroy();
    }
  }, []);

  return <div ref={editorRef} className="h-full -ml-1"></div>;
}

export default Editor;
