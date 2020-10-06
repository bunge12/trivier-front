import React from "react";
import styled from "styled-components";
import TextSmall from "./TextSmall";

const Select = styled.select`
  font-size: 16px;
  margin-bottom: 3vh;
`;
const Container = styled.div`
  text-align: center;
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
  return (
    <Container>
      <TextSmall text="Select a category" />
      <Select>{options}</Select>
      <TextSmall text="Select difficulty" />
      <Select>{levels}</Select>
    </Container>
  );
}
