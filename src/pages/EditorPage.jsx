import React, { useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Editor from "../components/Editor.jsx";
import ChatSidebar from "../components/ChatSidebar.jsx";
import { BsChatSquareText } from "react-icons/bs";

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [host, setHost] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const socketRef = useRef(null);

  const location = useLocation();
  const { roomId } = useParams();
  const username = location.state?.username;

  const toggleChatSidebar = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/6 h-full">
        <Sidebar clients={clients} host={host} />
      </div>
      <div className="w-5/6 h-full relative">
        <Editor
          setClients={setClients}
          setHost={setHost}
          socketRef={socketRef}
        />
      </div>
      {isChatOpen ? null : (
        <button
          onClick={toggleChatSidebar}
          className="absolute top-4 right-4 flex justify-center items-center gap-2 font-semibold bg-[#d6fb41] text-black py-2 px-4 rounded-md shadow-md z-10"
        >
          <BsChatSquareText className="text-xl" /> Chat
        </button>
      )}

      <ChatSidebar
        isOpen={isChatOpen}
        toggleSidebar={toggleChatSidebar}
        socketRef={socketRef}
        username={username}
        roomId={roomId}
      />
    </div>
  );
}

export default EditorPage;
