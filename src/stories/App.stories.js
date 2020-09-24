import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import TextInput from "../components/TextInput";
import Button from "../components/Button";
import WaitingRoom from "../components/WaitingRoom";
import GameInfo from "../components/GameInfo";
import Question from "../components/Question";

const players = [
  { id: "YZI6TU", name: "Artur", score: 8 },
  { id: "KJBUYG", name: "Josh", score: 3 },
  { id: "FDXDXG", name: "Sky", score: 9 },
];

const question1 = {
  category: "General Knowledge",
  type: "multiple",
  difficulty: "easy",
  question: "On a dartboard, what number is directly opposite No. 1?",
  correct_answer: "19",
  all_answers: ["19", "20", "12", "15"],
};

const question2 = {
  category: "Entertainment: Music",
  type: "boolean",
  difficulty: "easy",
  question:
    "The music group Daft Punk got their name from a negative review they recieved.",
  correct_answer: "True",
  all_answers: ["True", "False"],
};

const question3 = {
  category: "General Knowledge",
  type: "multiple",
  difficulty: "easy",
  question: "Which of the following presidents is not on Mount Rushmore?",
  correct_answer: "John F. Kennedy",
  all_answers: [
    "Theodore Roosevelt",
    "Abraham Lincoln",
    "John F. Kennedy",
    "Thomas Jefferson",
  ],
};

storiesOf("App", module)
  .add("Room Search Field", () => (
    <TextInput placeholder="Enter Room Code" callback={action()} />
  ))
  .add("Name Add Field", () => (
    <TextInput placeholder="Enter Your Name" callback={action()} />
  ))
  .add("New Game Button", () => (
    <Button text="New Game" callback={action("clicked")} />
  ))
  .add("Join Room Button", () => (
    <Button text="Join Room" callback={action("clicked")} />
  ))
  .add("Waiting Room", () => <WaitingRoom players={players} />)
  .add("Info Bar", () => <GameInfo name={"Artur"} room={"ABCD"} />)
  .add("Multiple Choice Question", () => <Question data={question1} />)
  .add("Multiple Choice Text Question", () => <Question data={question3} />)
  .add("True/False Question", () => <Question data={question2} />);
