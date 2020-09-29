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
import Notification from "./components/Notification";
import quiz from "./images/quiz.svg";

const WELCOME = "WELCOME"; // Welcome Screen
const NEW = "NEW"; // Create new Room
const JOIN = "JOIN"; // Join Existing Room
const NAME = "NAME"; // Add name to existing room
const WAITING = "WAITING"; // Waiting Room
const PLAY = "PLAY"; // Questions
const SCOREBOARD = "SCOREBOARD"; // Score Board
const NOTIF_TIMEOUT = 4000; // in ms

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
const Link = styled.span`
  color: #1d365c;
  font-size: x-small;
  text-decoration: none;
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
      setNotification(
        { type: "success", message: `Joined room ${roomId}` },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
      setCurrentGameId(roomId);
      setMode(NAME);
    });
    socket.on("roomNotFound", () => {
      setNotification(
        { type: "error", message: "Room not found!" },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
    });
    socket.on("waitingToStart", (data, admin) => {
      setGameData(data);
      setCurrentGameId(data[0].room);
      setMode(WAITING);
      admin && setAdmin(true);
      setCurrentQuestion(data[0].questions[0]);
    });
    socket.on("someoneLeft", (data) => {
      setGameData(data);
    });
    socket.on("gameStarted", () => {
      setMode(PLAY);
    });
    socket.on("nextQuestion", (data, count) => {
      setCurrentQuestion(data[0].questions[count + 1]);
    });
    socket.on("gameOver", (data) => {
      setGameData(data);
      setMode(SCOREBOARD);
    });
    socket.on("gameEnded", () => {
      setNotification(
        { type: "error", message: "Game Ended since the admin left!" },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
      setMode(WELCOME);
      setCurrentGameId(null);
      setGameData(null);
    });
    socket.on("serverError", () => {
      setNotification(
        { type: "error", message: "Server Error" },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
      setMode(WELCOME);
      setCurrentGameId(null);
      setGameData(null);
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
  const playAgain = () => {
    socket.emit("playAgain", currentGameId);
  };
  const leaveRoom = () => {
    setMode(WELCOME);
    setCurrentGameId(null);
    socket.emit("leaveRoom", currentGameId, userId, admin);
  };

  return (
    <div className="App">
      <Title>Trivier</Title>
      {currentGameId && <GameInfo name={name} room={currentGameId}></GameInfo>}
      {mode === WELCOME && (
        <>
          <Image src={quiz} alt="drawing of an online quiz" />
          <p>
            Play online trivia with your friends! Create or join an existing
            room and compete with your friends wherever they are!
          </p>
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
          <br />
          <Link
            onClick={() => {
              setMode(WELCOME);
            }}
          >
            Go Back
          </Link>
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
          {admin && <Button text="Start Game" callback={startGame}></Button>}
          <br />
          {admin &&
            gameData[0].players.length === 1 &&
            "Waiting for other players to join..."}
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
      {mode === SCOREBOARD && (
        <>
          <ScoreBoard players={gameData[0].players} />
          <br />
          {admin && <Button text="Play Again" callback={playAgain}></Button>}
          <br />
          <Link onClick={leaveRoom}>End Game</Link>
        </>
      )}
      {notification && (
        <Notification type={notification.type} text={notification.message} />
      )}
    </div>
  );
}

export default App;
