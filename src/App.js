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
import ReactGA from "react-ga";

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
const Footer = styled.footer`
  color: white;
  margin-top: 1rem;
  font-size: x-small;
  a:visited {
    color: white;
  }
  a {
    color: white;
  }
`;
const Text = styled.div`
  font-size: small;
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
  ReactGA.initialize("G-DGFT0QCEJJ");
  ReactGA.pageview(window.location.pathname + window.location.search);
  const [searchRoomId, setSearchRoomId] = useState(null);
  const [currentRoomId, setcurrentRoomId] = useState(null);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [mode, setMode] = useState(WELCOME);
  const [admin, setAdmin] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(null);
  const [number, setNumber] = useState(1);
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
      setcurrentRoomId(roomId);
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
    socket.on("waitingToStart", (data, questions, admin) => {
      setGameData(data);
      setcurrentRoomId(data[0].room);
      setMode(WAITING);
      setNumberOfQuestions(questions);
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
      setNumber(count + 2);
      setCurrentQuestion(data[0].questions[count + 1]);
    });
    socket.on("gameOver", (data) => {
      setGameData(data);
      setMode(SCOREBOARD);
    });
    socket.on("gameEnded", () => {
      setNotification(
        { type: "error", message: "Game ended since the admin left!" },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
      setMode(WELCOME);
      setcurrentRoomId(null);
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
      setcurrentRoomId(null);
      setGameData(null);
    });
    // eslint-disable-next-line
  }, []);

  // App State modifiers
  const searchRoom = (code) => {
    setSearchRoomId(code);
  };
  const saveName = (name) => {
    setName(name);
  };

  // Socket Actions
  const getRoom = () => {
    socket.emit("searchRoom", searchRoomId);
  };
  const newGame = () => {
    socket.emit("newGame", name, userId);
  };
  const addToGame = () => {
    socket.emit("addToGame", currentRoomId, name, userId);
  };
  const startGame = () => {
    socket.emit("startGame", currentRoomId);
  };
  const recordScore = () => {
    socket.emit("recordScore", currentRoomId, userId);
  };
  const playAgain = () => {
    socket.emit("playAgain", currentRoomId);
  };
  const leaveRoom = () => {
    setMode(WELCOME);
    setcurrentRoomId(null);
    socket.emit("leaveRoom", currentRoomId, userId, admin);
  };

  return (
    <>
      <div className="App">
        <Title>Trivier</Title>
        {currentRoomId && (
          <GameInfo name={name} room={currentRoomId}></GameInfo>
        )}
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
            <Button text="Find room" callback={getRoom}></Button>
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
            <Text>Waiting room:</Text>
            <WaitingRoom players={gameData[0].players} />
            {admin && gameData[0].players.length === 1 && (
              <Text>Wait for other players to join, or</Text>
            )}
            {admin && (
              <>
                <Button text="Start Game" callback={startGame}></Button>
                <br />
                <Link onClick={leaveRoom}>End Game</Link>
              </>
            )}
          </>
        )}
        {mode === PLAY && (
          <>
            {
              <Question
                key={currentQuestion.question}
                data={currentQuestion}
                score={recordScore}
                questions={numberOfQuestions}
                number={number}
              ></Question>
            }
          </>
        )}
        {mode === SCOREBOARD && (
          <>
            <ScoreBoard
              players={gameData[0].players}
              number={numberOfQuestions}
            />
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
      <Footer>
        Made by{" "}
        <a
          href="https://github.com/bunge12"
          target="_blank"
          rel="noopener noreferrer"
        >
          Artur Iatsko
        </a>
      </Footer>
    </>
  );
}

export default App;
