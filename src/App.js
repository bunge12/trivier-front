import React, { useEffect, useState } from "react";
import "./App.css";
// import axios from "axios";
import styled from "styled-components";
import { socket } from "./service/socket";
import TextInput from "./components/TextInput";
import Button from "./components/Button";

const WELCOME = "WELCOME"; // Welcome Screen
const NEW = "NEW"; // Create new Room
const JOIN = "JOIN"; // Join Existing Room
const NAME = "NAME"; // Add name to existing room
const WAITING = "WAITING"; // Waiting Room

const Title = styled.div``;

const generateId = (length) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function App() {
  const [searchGameId, setSearchGameId] = useState(null);
  const [currentGameId, setCurrentGameId] = useState(null);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [mode, setMode] = useState(WELCOME);
  const [admin, setAdmin] = useState(false);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    setUserId(generateId(6));
    socket.on("roomFound", (roomId) => {
      setCurrentGameId(roomId);
      setMode(NAME);
      console.log("room joined", roomId);
    });
    socket.on("roomNotFound", () => {
      console.log("room not found");
    });
    socket.on("waitingToStart", (data, admin) => {
      setGameData(data);
      setCurrentGameId(data[0].room);
      setMode(WAITING);
      admin && setAdmin(true);
      console.log("created, waiting  to start");
    });
    // eslint-disable-next-line
  }, []);

  const getGame = () => {
    socket.emit("searchGame", searchGameId);
  };
  const newGame = () => {
    console.log("newGame");
    socket.emit("newGame", name, userId);
  };
  const addToGame = () => {
    socket.emit("addToGame", currentGameId, name, userId);
  };
  const searchRoom = (code) => {
    setSearchGameId(code);
  };
  const saveName = (name) => {
    setName(name);
  };

  return (
    <div className="App">
      <Title>Trivier</Title>
      {currentGameId && (
        <>
          Room code {currentGameId} | ({name})
          <br />
        </>
      )}
      {mode === WELCOME && (
        <>
          <button onClick={() => setMode(NEW)}>New Game</button>
          <br />
          <button onClick={() => setMode(JOIN)}>Join Game</button>
        </>
      )}
      {mode === NEW && (
        <>
          <TextInput
            placeholder="Enter Your Name"
            callback={saveName}
          ></TextInput>
          <Button text="Create room" callback={newGame}></Button>
        </>
      )}
      {mode === JOIN && (
        <>
          <TextInput
            placeholder="Enter Room Code"
            callback={searchRoom}
          ></TextInput>
          <Button text="Find room" callback={getGame}></Button>
        </>
      )}
      {mode === NAME && (
        <>
          <TextInput
            placeholder="Enter Your Name"
            callback={saveName}
          ></TextInput>
          <Button text="Join room" callback={addToGame}></Button>
        </>
      )}
      {mode === WAITING && (
        <>
          <br />
          Waiting room:
          {gameData[0].players.map((each, index) => (
            <ul key={index}>{each.name}</ul>
          ))}
          {admin && <button>start</button>}
        </>
      )}
    </div>
  );
}

export default App;
