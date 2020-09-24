import React from "react";
import styled from "styled-components";

const Container = styled.div``;
const Text = styled.div``;
const Options = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;
const SingleOption = styled.div`
  background: white;
  padding: 1.5vh;
  border: 1px solid black;
  border-radius: 5%;
  margin-top: 1.5vh;
`;

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Question(props) {
  const { question, correct_answer, incorrect_answers, type } = props.data;
  let answers = incorrect_answers.concat(correct_answer);
  if (type === "multiple") {
    answers = shuffle(answers);
  }
  if (type === "boolean") {
    answers = ["True", "False"];
  }
  const list = answers.map((each, index) => (
    <SingleOption key={index}>{each}</SingleOption>
  ));
  return (
    <Container>
      <Text>{question}</Text>
      <Options>{list}</Options>
    </Container>
  );
}
