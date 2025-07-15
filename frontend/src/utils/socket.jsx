import { io } from "socket.io-client";

export const socket = io("https://real-time-notepad-7a5c.onrender.com", {
  transports: ["websocket"],
});
