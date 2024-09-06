import React, { useState, useRef, useEffect } from "react";
import Avatar from "react-avatar";
import { MdOutlineClose } from "react-icons/md";
import { useLocation } from "react-router-dom";

function ChatSidebar({ isOpen, toggleSidebar, socketRef, username, roomId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const host = location.state?.username;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("chat_message", ({ username, message }) => {
        setMessages((prev) => [...prev, { username, message }]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat_message");
      }
    };
  }, [socketRef.current]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socketRef.current) {
      socketRef.current.emit("chat_message", {
        roomId,
        username,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div
      className={`${
        isOpen ? "w-1/4" : "w-0"
      } h-full absolute right-0 bg-slate-800 text-white transition-all duration-300 overflow-hidden`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#d6fb41]">Chat</h2>
        <button
          onClick={toggleSidebar}
          className="text-red-600 hover:bg-slate-900 p-2 rounded-full focus:outline-none"
        >
          <MdOutlineClose className="text-2xl" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex items-center gap-2 ${
              msg.username === host ? "text-[#d6fb41]" : "text-white"
            }`}
          >
            <Avatar name={msg.username} size="40" round="20px" />
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4">
        <input
          type="text"
          className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="w-full mt-2 p-2 bg-blue-500 rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatSidebar;
