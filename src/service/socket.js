import io from "socket.io-client";
require("dotenv").config();

const ENDPOINT = "https://trivier.azurewebsites.net/";
// const ENDPOINT = "http://localhost:8080";

export const socket = io(ENDPOINT);
