import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import styled from "styled-components";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:8001";

const Title = styled.div``;

function App() {
  // const [game, setGame] = useState(null);
  useEffect(() => {
    const io = socketIOClient(ENDPOINT);
  });
  const getGame = () => {
    axios
      .get("/api/game/3DTU")
      .then((data) => {
        console.log(data.data[0]);
      })
      .catch((e) => {
        console.log("Not found");
      });
  };

  return (
    <div className="App">
      <Title>Trivier</Title>
      <button onClick={getGame}>Push me</button>
    </div>
  );
}

export default App;
