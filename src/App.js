import React, { useEffect, useState } from "react";
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
import generateId from "./helper/generateId";
import usePersistentState from "./hooks/usePersistentState";
import queryString from "query-string";

import {
  WELCOME,
  NEW,
  JOIN,
  NAME,
  WAITING,
  NOTIF_TIMEOUT,
  PLAY,
  SCOREBOARD,
} from "./helpers/modes";

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
const Link = styled.div`
  color: #1d365c;
  font-size: x-small;
  text-decoration: none;
  margin-top: 2vh;
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

function App() {
  const [searchRoomId, setSearchRoomId] = useState("");
  const [currentRoomId, setcurrentRoomId] = useState(null);
  const [name, setName] = usePersistentState("name", "");
  const [userId, setUserId] = useState(null);
  const [mode, setMode] = useState(WELCOME);
  const [admin, setAdmin] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(null);
  const [number, setNumber] = useState(1);
  const [notification, setNotification] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({});

  useEffect(() => {
    // Google Analytics
    ReactGA.initialize("UA-179116325-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
    setUserId(generateId(6));

    // Room Found
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

    // Room Not Found
    socket.on("roomNotFound", () => {
      window.history.replaceState({}, document.title, "/");
      setNotification(
        { type: "error", message: "Room not found!" },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
    });

    // Waiting Room
    socket.on("waitingToStart", (data, questions, admin) => {
      setGameData(data);
      setcurrentRoomId(data[0].room);
      setMode(WAITING);
      setNumberOfQuestions(questions);
      admin && setAdmin(true);
      setCurrentQuestion(data[0].questions[0]);
    });

    // Update Game Data when someone leaves
    socket.on("someoneLeft", (data) => {
      setGameData(data);
    });

    // Start the game
    socket.on("gameStarted", () => {
      setMode(PLAY);
    });

    // Proceed to next question
    socket.on("nextQuestion", (data, count) => {
      setNumber(count + 2);
      setCurrentQuestion(data[0].questions[count + 1]);
    });

    // Game Finished
    socket.on("gameOver", (data) => {
      setGameData(data);
      setMode(SCOREBOARD);
    });

    // Game ended since admin left
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

    // Server error
    socket.on("gameError", (message) => {
      setNotification(
        { type: "error", message: `Error: ${message}` },
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
  const back = () => {
    setMode(WELCOME);
  };

  useEffect(() => {
    const value = queryString.parse(window.location.search);
    const room = value.room;
    if (room) {
      socket.emit("searchRoom", room);
    }
  }, []);

  // Socket Actions
  const getRoom = () => {
    searchRoomId === ""
      ? setNotification(
          { type: "error", message: "Please enter room code to continue" },
          setTimeout(() => {
            setNotification(null);
          }, NOTIF_TIMEOUT)
        )
      : socket.emit("searchRoom", searchRoomId);
  };
  const newGame = () => {
    name === ""
      ? setNotification(
          { type: "error", message: "Please enter your name to continue" },
          setTimeout(() => {
            setNotification(null);
          }, NOTIF_TIMEOUT)
        )
      : socket.emit("newGame", name, userId);
  };
  const addToGame = () => {
    name === ""
      ? setNotification(
          { type: "error", message: "Please enter your name to continue" },
          setTimeout(() => {
            setNotification(null);
          }, NOTIF_TIMEOUT)
        )
      : socket.emit("addToGame", currentRoomId, name, userId);
  };
  const startGame = () => {
    socket.emit("startGame", currentRoomId);
  };
  const recordScore = () => {
    socket.emit("recordScore", currentRoomId, userId);
  };
  const playAgain = () => {
    setNumber(1);
    socket.emit("playAgain", currentRoomId, gameData[0].token);
  };
  const leaveRoom = () => {
    setcurrentRoomId(null);
    setCurrentQuestion({});
    setGameData(null);
    setNumber(1);
    setMode(WELCOME);
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
            <Button text="New Room" callback={() => setMode(NEW)}></Button>
            <br />
            <Button text="Join Room" callback={() => setMode(JOIN)}></Button>
          </>
        )}
        {mode === NEW && (
          <>
            <TextInput
              placeholder="Enter Your Name"
              callback={saveName}
              value={name}
            ></TextInput>
            <br />
            <Button text="Create room" callback={newGame}></Button>
            <Link onClick={back}>Go Back</Link>
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
            <Link onClick={back}>Go Back</Link>
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
            <Link onClick={leaveRoom}>Leave Room</Link>
          </>
        )}
        {mode === WAITING && (
          <>
            <WaitingRoom players={gameData[0].players} room={currentRoomId} />
            {admin && gameData[0].players.length === 1 && (
              <Text>Wait for other players to join, or</Text>
            )}
            {admin ? (
              <>
                <Button text="Start Game" callback={startGame}></Button>
                <br />
                <Link onClick={leaveRoom}>End Game</Link>
              </>
            ) : (
              <Link onClick={leaveRoom}>Leave Room</Link>
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
