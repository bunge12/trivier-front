import io from "socket.io-client";

const ENDPOINT = "https://trivier-a33b2.ue.r.appspot.com/";
// const ENDPOINT = "http://localhost:8080";

export const socket = io(ENDPOINT);
