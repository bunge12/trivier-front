import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import { socket } from "./service/socket";
import TextInput from "./components/TextInput";
import Button from "./components/Button";
import WaitingRoom from "./components/WaitingRoom";
import GameInfo from "./components/GameInfo";
import Question from "./components/Question";
import ScoreBoard from "./components/ScoreBoard";
import quiz from "./images/quiz.svg";

const WELCOME = "WELCOME"; // Welcome Screen
const NEW = "NEW"; // Create new Room
const JOIN = "JOIN"; // Join Existing Room
const NAME = "NAME"; // Add name to existing room
const WAITING = "WAITING"; // Waiting Room
const PLAY = "PLAY"; // Questions
const SCOREBOARD = "SCOREBOARD"; // Score Board

const Title = styled.div`
  font-family: "Luckiest Guy", cursive;
  margin-bottom: 1vh;
  font-size: xx-large;
  color: #22c1c3;
`;
const Image = styled.img`
  width: 75%;
  margin: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

// Helper Functions
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
  const [notification, setNotification] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({});

  // Socket.io listeners
  useEffect(() => {
    setUserId(generateId(6));
    socket.on("roomFound", (roomId) => {
      setNotification("Room found");
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
      setCurrentQuestion(data[0].questions[0]);
    });
    socket.on("gameStarted", () => {
      setMode(PLAY);
    });
    socket.on("nextQuestion", (data, count) => {
      console.log("next q", data, count);
      setCurrentQuestion(data[0].questions[count + 1]);
    });
    socket.on("gameOver", (data) => {
      setGameData(data);
      setMode(SCOREBOARD);
    });
    // eslint-disable-next-line
  }, []);

  // App State modifiers
  const searchRoom = (code) => {
    setSearchGameId(code);
  };
  const saveName = (name) => {
    setName(name);
  };

  // Socket Actions
  const getGame = () => {
    socket.emit("searchGame", searchGameId);
  };
  const newGame = () => {
    socket.emit("newGame", name, userId);
  };
  const addToGame = () => {
    socket.emit("addToGame", currentGameId, name, userId);
  };
  const startGame = () => {
    socket.emit("startGame", currentGameId);
  };
  const recordScore = () => {
    socket.emit("recordScore", currentGameId, userId);
  };

  return (
    <div className="App">
      <Title>Trivier</Title>
      {currentGameId && <GameInfo name={name} room={currentGameId}></GameInfo>}
      {mode === WELCOME && (
        <>
          <Image src={quiz} alt="drawing of quiz" />
          <Button text="New Game" callback={() => setMode(NEW)}></Button>
          <br />
          <Button text="Join Game" callback={() => setMode(JOIN)}></Button>
        </>
      )}
      {mode === NEW && (
        <>
          <TextInput
            placeholder="Enter Your Name"
            callback={saveName}
          ></TextInput>
          <br />
          <Button text="Create room" callback={newGame}></Button>
        </>
      )}
      {mode === JOIN && (
        <>
          <TextInput
            placeholder="Enter Room Code"
            callback={searchRoom}
          ></TextInput>
          <br />
          <Button text="Find room" callback={getGame}></Button>
        </>
      )}
      {mode === NAME && (
        <>
          <TextInput
            placeholder="Enter Your Name"
            callback={saveName}
          ></TextInput>
          <br />
          <Button text="Join room" callback={addToGame}></Button>
        </>
      )}
      {mode === WAITING && (
        <>
          <br />
          Waiting room:
          <WaitingRoom players={gameData[0].players} />
          <Button text="Start Game" callback={startGame}></Button>
          {/* {admin && gameData[0].players.length > 1 && (
            <Button text="Start Game" callback={startGame}></Button>
          )}
          {admin &&
            gameData[0].players.length === 1 &&
            "Waiting for other players to join..."} */}
        </>
      )}
      {mode === PLAY && (
        <>
          {
            <Question
              key={currentQuestion.question}
              data={currentQuestion}
              score={recordScore}
            ></Question>
          }
        </>
      )}
      {mode === SCOREBOARD && <ScoreBoard players={gameData[0].players} />}
    </div>
  );
}

export default App;
