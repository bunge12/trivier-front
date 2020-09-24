import React, { useState } from "react";
import styled from "styled-components";
import SingleOption from "./SingleOption";

const Container = styled.div``;
const Text = styled.div``;
const Options = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

export default function Question(props) {
  const { question, correct_answer, all_answers, type } = props.data;
  const [showCorrect, setShowCorrect] = useState(null);
  const [disabled, setDisabled] = useState(false);
  // let answers = incorrect_answers.concat(correct_answer);
  let answers;
  if (type === "multiple") {
    answers = all_answers;
  }
  if (type === "boolean") {
    answers = ["True", "False"];
  }
  const checkWinner = (answer) => {
    answer === correct_answer ? console.log("YES") : console.log("NO");
    setShowCorrect(answers.indexOf(correct_answer));
    setDisabled(true);
  };
  const list = answers.map((each, index) => (
    <SingleOption
      key={index}
      callback={checkWinner}
      text={each}
      winner={correct_answer}
      showCorrect={showCorrect}
      answerIndex={index}
      disabled={disabled}
    ></SingleOption>
  ));
  return (
    <Container>
      <Text>{question}</Text>
      <Options>{list}</Options>
    </Container>
  );
}
