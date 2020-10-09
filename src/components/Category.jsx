import React from "react";
import styled from "styled-components";
import TextSmall from "./TextSmall";

const Select = styled.select`
  font-size: 16px;
  margin-bottom: 2rem;
  background: none;
  text-align-last: center;
  padding: 0.2em;
  border: 1px solid #0075c7;
  border-radius: 1em;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  color: #0075c7;
  @media only screen and (min-width: 600px) {
    padding: 1em;
  }
  :focus {
    outline: none;
  }
`;
const Container = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;
const difficulties = [
  { text: "Any Difficulty", value: "any" },
  { text: "Easy", value: "easy" },
  { text: "Medium", value: "medium" },
  { text: "Hard", value: "hard" },
];

export default function Category(props) {
  const options = props.data.trivia_categories.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));
  const levels = difficulties.map((each) => (
    <option key={each.value} value={each.value}>
      {each.text}
    </option>
  ));
  const save = (event) => {
    props.callback(event.target.name, event.target.value);
  };
  return (
    <Container>
      <TextSmall text="Select a category" />
      <Select name="category" onChange={save}>
        {options}
      </Select>
      <br />
      <br />

      <TextSmall text="Select difficulty" />
      <Select name="difficulty" onChange={save}>
        {levels}
      </Select>
    </Container>
  );
}
