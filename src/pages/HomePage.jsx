import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

function HomePage() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleNewRoomCreation = () => {
    const uniqueId = uuidv4();
    setRoomId(uniqueId);
    toast.success("New Room Generated!");
  };

  const handleRoomJoining = (e) => {
    e.preventDefault();
    if (!username || !roomId) {
      toast.error("Username and RoomId is required!");
      return;
    }
    toast.success("New Room Joined!");
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  return (
    <div className="w-screen h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('bg1.jpg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg bg-slate-700 mt-16 px-6 pt-6 rounded-lg bg-opacity-80 text-white">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="logo" className="w-36" />
          </div>
          <form
            onSubmit={handleRoomJoining}
            className="mb-0 -mt-4 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Paste Invitation Room ID
            </p>

            <div>
              <label htmlFor="roomId" className="sr-only">
                RoomId
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={roomId}
                  className="w-full rounded-lg bg-slate-900 placeholder:font-medium placeholder:tracking-wider focus:bg-slate-950 outline-none p-4 pe-12 text-sm shadow-sm"
                  placeholder="ROOM ID"
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={username}
                  className="w-full rounded-lg bg-slate-900 placeholder:font-medium placeholder:tracking-wider focus:bg-slate-950 outline-none p-4 pe-12 text-sm shadow-sm"
                  placeholder="USERNAME"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-green-500 hover:bg-green-600 active:scale-95 duration-200 px-5 py-2 font-semibold text-white"
            >
              Join
            </button>

            <p className="text-center text-sm text-white text-opacity-80">
              If you don't have any invitation Id? Create{" "}
              <Link
                className="text-blue-500 font-semibold hover:text-blue-600 underline"
                to=""
                onClick={handleNewRoomCreation}
              >
                New Room
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
