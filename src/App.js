import React, { useEffect, useState } from "react";
import "./App.css";
// import axios from "axios";
import styled from "styled-components";
import { socket } from "./service/socket";
import Join from "./components/Join";

const Title = styled.div``;

function App() {
  const [gameId, setGameId] = useState(null);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    socket.on("roomJoined", (data) => {
      setGameData(data);
      console.log("room joined", data);
    });
    socket.on("roomNotFound", () => {
      console.log("room not found");
    });
  }, []);

  const getGame = () => {
    console.log("searchGame sent");
    socket.emit("searchGame", gameId);
  };
  const searchRoom = (code) => {
    setGameId(code);
  };

  return (
    <div className="App">
      <Title>Trivier</Title>
      <Join callback={searchRoom}></Join>
      <button onClick={getGame}>Find room</button>
      {/* {!gameData && gameData.players} */}
    </div>
  );
}

export default App;
