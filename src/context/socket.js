// src/socket.js
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BASE_URL, {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;
