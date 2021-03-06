import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { socket } from "./service/socket";
import axios from "axios";
import TextInput from "./components/TextInput";
import Button from "./components/Button";
import WaitingRoom from "./components/WaitingRoom";
import GameInfo from "./components/GameInfo";
import Question from "./components/Question";
import ScoreBoard from "./components/ScoreBoard";
import Notification from "./components/Notification";
import Category from "./components/Category";
import quiz from "./images/quiz.svg";
import ReactGA from "react-ga";
import generateId from "./helpers/generateId";
import usePersistentState from "./hooks/usePersistentState";
import queryString from "query-string";

import {
  WELCOME,
  SETTINGS,
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
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [name, setName] = usePersistentState("name", "");
  const [userId, setUserId] = useState(null);
  const [mode, setMode] = useState(WELCOME);
  const [admin, setAdmin] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(null);
  const [number, setNumber] = useState(1);
  const [notification, setNotification] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [settings, setSettings] = useState({ category: 9, difficulty: "any" });
  const [categories, setCategories] = useState({});

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
      setCurrentRoomId(roomId);
      setAdmin(false);
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
      setNumber(1);
      setNotification(null);
      setGameData(data);
      setCurrentRoomId(data[0].room);
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
    socket.on("nextQuestion", (data, num_ques, count) => {
      setNumber(count + 1);
      if (count !== num_ques) setCurrentQuestion(data[0].questions[count]);
    });

    // Game Finished
    socket.on("gameOver", (data) => {
      setGameData(data);
      setMode(SCOREBOARD);
    });

    // Game Ended / Server error
    socket.on("gameEnded", (message) => {
      setNotification(
        { type: "error", message: message },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
      setMode(WELCOME);
      setCurrentRoomId(null);
      setGameData(null);
      setAdmin(false);
      setNumberOfQuestions(null);
      setNumber(1);
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
  const saveSettings = (setting, value) => {
    if (setting === "category") {
      setSettings({ ...settings, category: value });
    }
    if (setting === "difficulty") {
      setSettings({ ...settings, difficulty: value });
    }
  };

  useEffect(() => {
    axios
      .get("https://opentdb.com/api_category.php")
      .then((data) => setCategories(data.data));
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
    if (name === "") {
      setNotification(
        { type: "error", message: "Please enter your name to continue" },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
    } else {
      setNotification(
        { type: "success", message: "Loading room details, please wait" },
        setTimeout(() => {
          setNotification(null);
        }, NOTIF_TIMEOUT)
      );
      socket.emit("newGame", name, userId, settings);
    }
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
  const recordScore = (value) => {
    socket.emit("recordScore", currentRoomId, userId, value);
  };
  const playAgain = () => {
    setNumber(1);
    socket.emit("playAgain", currentRoomId, settings, gameData[0].token);
  };
  const leaveRoom = () => {
    setCurrentRoomId(null);
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
            <Button text="New Room" callback={() => setMode(SETTINGS)}></Button>
            <br />
            <Button text="Join Room" callback={() => setMode(JOIN)}></Button>
          </>
        )}
        {mode === SETTINGS && (
          <>
            <Category data={categories} callback={saveSettings} />
            <Button text="Continue" callback={() => setMode(NEW)}></Button>
            <Link onClick={back}>Go Back</Link>
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
              value={name}
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
            {admin ? (
              <Link onClick={leaveRoom}>End Game</Link>
            ) : (
              <Link onClick={leaveRoom}>Leave Room</Link>
            )}
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
