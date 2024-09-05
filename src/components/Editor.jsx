import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import toast from "react-hot-toast";
import { initializeSocketConnection } from "../socket";

function Editor({ setClients, setHost, socketRef }) {
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState("// Start coding here...");

  // Effect for handling socket connection
  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initializeSocketConnection();

        const handleErrors = (err) => {
          toast.error("Socket connection failed!");
          navigate("/");
        };

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        socketRef.current.emit("join", {
          roomId,
          username: location.state?.username,
        });

        // Listening for joined event
        socketRef.current.on(
          "joined",
          ({ clients, host, username, socketId }) => {
            if (username !== location.state?.username) {
              toast.success(`${username} joined the room.`);
            }
            setClients(clients);
            setHost(host);
          }
        );

        // Listening for disconnected event
        socketRef.current.on("disconnected", ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        });

        // Listening for code change events
        socketRef.current.on("code_change", ({ code }) => {
          setCode(code);
        });
      } catch (error) {
        console.error("Error initializing socket connection:", error);
      }
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
  }, [roomId, location, navigate, setClients, setHost]);

  // Function to handle code changes
  const handleCodeChange = (value) => {
    setCode(value);
    if (socketRef.current) {
      socketRef.current.emit("code_change", {
        roomId,
        code: value,
      });
    }
  };

  return (
    <div className="h-full -ml-1">
      <CodeMirror
        className="h-screen"
        value={code}
        height="100%"
        theme={oneDark}
        extensions={[javascript({ jsx: true })]}
        onChange={(value) => {
          handleCodeChange(value);
        }}
      />
    </div>
  );
}

export default Editor;
