// src/socket.js
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BASE_URL || "http://localhost:8000", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
