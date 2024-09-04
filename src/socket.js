// building socket connection as soon as it renders.
import { io } from "socket.io-client";

export const initializeSocketConnection = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  return io(import.meta.env.VITE_BACKEND_URL, options);
};
