import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SingleOption from "./SingleOption";

const Container = styled.div``;
const Text = styled.div``;
const Options = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;
const Timer = styled.div`
  text-align: center;
`;

export default function Question(props) {
  const { question, correct_answer, all_answers, type } = props.data;
  const [showCorrect, setShowCorrect] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [counter, setCounter] = useState(5);

  let answers;
  if (type === "multiple") {
    answers = all_answers;
  }
  if (type === "boolean") {
    answers = ["True", "False"];
  }

  useEffect(() => {
    if (counter < 1) {
      console.log("stop");
      setShowCorrect(answers.indexOf(correct_answer));
      setDisabled(true);
    }
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter, answers, correct_answer]);
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
      <Timer>00:{counter > 9 ? counter : "0" + counter}</Timer>
    </Container>
  );
}
