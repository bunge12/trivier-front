import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import { socket } from "./service/socket";
import TextInput from "./components/TextInput";
import Button from "./components/Button";
import WaitingRoom from "./components/WaitingRoom";
import GameInfo from "./components/GameInfo";
import Question from "./components/Question";

const WELCOME = "WELCOME"; // Welcome Screen
const NEW = "NEW"; // Create new Room
const JOIN = "JOIN"; // Join Existing Room
const NAME = "NAME"; // Add name to existing room
const WAITING = "WAITING"; // Waiting Room
const PLAY = "PLAY"; // Questions

const Title = styled.div`
  margin-bottom: 1vh;
`;

// Helper Functions
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const formatQuestion = (data, number) => {
  const question = data[0].questions[0];
  question.all_answers = shuffle(
    data[0].questions[0].incorrect_answers.concat(
      data[0].questions[0].correct_answer
    )
  );
  return question;
};
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
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});

  // Socket.io listeners
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
      // const firstQuestion = data[0].questions[0];
      // firstQuestion.all_answers = shuffle(
      //   data[0].questions[0].incorrect_answers.concat(
      //     data[0].questions[0].correct_answer
      //   )
      // );
      setCurrentQuestion(formatQuestion(data, questionNumber));
    });
    socket.on("gameStarted", () => {
      setMode(PLAY);
    });
    // eslint-disable-next-line
  }, []);

  // Game Functions modifiers
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

  return (
    <div className="App">
      <Title>Trivier</Title>
      {currentGameId && <GameInfo name={name} room={currentGameId}></GameInfo>}
      {mode === WELCOME && (
        <>
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
          {admin && gameData[0].players.length > 1 && (
            <Button text="Start Game" callback={startGame}></Button>
          )}
          {admin &&
            gameData[0].players.length === 1 &&
            "Waiting for other players to join..."}
        </>
      )}
      {mode === PLAY && <>{<Question data={currentQuestion}></Question>}</>}
    </div>
  );
}

export default App;
