import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [host, setHost] = useState(null);

  return (
    <div className="w-full h-screen flex">
      <div className="w-1/6 h-full">
        <Sidebar clients={clients} host={host} />
      </div>
      <div className="w-5/6 h-full">
        <Editor setClients={setClients} setHost={setHost} />
      </div>
    </div>
  );
}

export default EditorPage;
