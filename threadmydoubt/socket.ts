import { io } from "socket.io-client";

const socket = io("https://threadmydoubt.onrender.com");

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

export default socket;