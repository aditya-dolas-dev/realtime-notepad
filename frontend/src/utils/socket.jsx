import { io } from "socket.io-client";

export const socket = io("https://realtime-notepad-k45e.onrender.com", {
  transports: ["websocket"],
});
