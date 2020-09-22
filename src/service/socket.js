import io from "socket.io-client";
const ENDPOINT = "http://localhost:8001";

export const socket = io(ENDPOINT);
