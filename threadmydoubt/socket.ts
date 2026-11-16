import { io } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "https://threadmydoubt-2.onrender.com";

const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["polling", "websocket"]
    //,
//     reconnection: true,
//     reconnectionAttempts: 10,
//     reconnectionDelay: 1000
});

socket.on("connect", () => {
    console.log("Socket connected successfully:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("Socket.IO connection error:", err.message);
});

export default socket;
