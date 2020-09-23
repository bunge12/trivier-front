import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import TextInput from "../components/TextInput";
import Button from "../components/Button";

const players = [
  { id: "YZI6TU", name: "Artur", score: 0 },
  { id: "YZI6TU", name: "Artur2", score: 0 },
  { id: "YZI6TU", name: "Artur3", score: 0 },
];
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
  ));
