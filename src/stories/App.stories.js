import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import TextInput from "../components/TextInput";
import Button from "../components/Button";
import WaitingRoom from "../components/WaitingRoom";
import GameInfo from "../components/GameInfo";
import Question from "../components/Question";
import ScoreBoard from "../components/ScoreBoard";
import Notification from "../components/Notification";
import Category from "../components/Category";

const players = [
  { id: "YZI6TU", name: "Artur", score: 8 },
  { id: "KJBUYG", name: "Josh", score: 3 },
  { id: "FDXDXG", name: "Opp", score: 9 },
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
  incorrect_answers: ["False"],
  all_answers: ["True", "False"],
};

const question3 = {
  category: "General Knowledge",
  type: "multiple",
  difficulty: "easy",
  question: "Which of the following presidents is not on Mount Rushmore?",
  correct_answer: "John F. Kennedy",
  incorrect_answer: [
    "Theodore Roosevelt",
    "Abraham Lincoln",
    "Thomas Jefferson",
  ],
  all_answers: [
    "Theodore Roosevelt",
    "Abraham Lincoln",
    "John F. Kennedy",
    "Thomas Jefferson",
  ],
};

const categories = {
  trivia_categories: [
    {
      id: 9,
      name: "General Knowledge",
    },
    {
      id: 10,
      name: "Entertainment: Books",
    },
    {
      id: 11,
      name: "Entertainment: Film",
    },
    {
      id: 12,
      name: "Entertainment: Music",
    },
    {
      id: 13,
      name: "Entertainment: Musicals & Theatres",
    },
    {
      id: 14,
      name: "Entertainment: Television",
    },
    {
      id: 15,
      name: "Entertainment: Video Games",
    },
    {
      id: 16,
      name: "Entertainment: Board Games",
    },
    {
      id: 17,
      name: "Science & Nature",
    },
    {
      id: 18,
      name: "Science: Computers",
    },
    {
      id: 19,
      name: "Science: Mathematics",
    },
    {
      id: 20,
      name: "Mythology",
    },
    {
      id: 21,
      name: "Sports",
    },
    {
      id: 22,
      name: "Geography",
    },
    {
      id: 23,
      name: "History",
    },
    {
      id: 24,
      name: "Politics",
    },
    {
      id: 25,
      name: "Art",
    },
    {
      id: 26,
      name: "Celebrities",
    },
    {
      id: 27,
      name: "Animals",
    },
    {
      id: 28,
      name: "Vehicles",
    },
    {
      id: 29,
      name: "Entertainment: Comics",
    },
    {
      id: 30,
      name: "Science: Gadgets",
    },
    {
      id: 31,
      name: "Entertainment: Japanese Anime & Manga",
    },
    {
      id: 32,
      name: "Entertainment: Cartoon & Animations",
    },
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
  .add("Waiting Room", () => <WaitingRoom players={players} room={"ABCD"} />)
  .add("Scoreboard", () => <ScoreBoard players={players} number={"10"} />)
  .add("Info Bar", () => <GameInfo name={"Artur"} room={"ABCD"} />)
  .add("Multiple Choice Question", () => (
    <Question data={question1} questions={10} number={5} />
  ))
  .add("Multiple Choice Text Question", () => (
    <Question data={question3} questions={10} number={5} />
  ))
  .add("True/False Question", () => (
    <Question data={question2} questions={10} number={5} />
  ))
  .add("Error message", () => (
    <Notification type={"error"} text={"Error message"}></Notification>
  ))
  .add("Success message", () => (
    <Notification type={"success"} text={"Success message"}></Notification>
  ))
  .add("Category Selection", () => <Category data={categories}></Category>);
