import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SingleOption from "./SingleOption";

const Container = styled.div`
  margin-top: 3vh;
`;
const Text = styled.div`
  @media only screen and (min-width: 1200px) {
    font-size: larger;
    font-weight: bold;
  }
`;
const Options = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 5vh;
`;
const Timer = styled.div`
  text-align: center;
  margin-top: 3vh;
  font-weight: bold;
  color: ${(props) => (props.color === "red" ? "red" : "black")};
  font-size: ${(props) => (props.color === "red" ? "larger" : "large")};
`;
const Count = styled.div`
  text-align: center;
  margin-top: 2vh;
  font-size: small;
`;

export default function Question(props) {
  const { question, correct_answer, all_answers, type } = props.data;
  const [showCorrect, setShowCorrect] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [counter, setCounter] = useState(10);

  let answers;
  if (type === "multiple") {
    answers = all_answers;
  }
  if (type === "boolean") {
    answers = ["True", "False"];
  }

  useEffect(() => {
    if (counter < 1) {
      setShowCorrect(answers.indexOf(correct_answer));
      setDisabled(true);
    }
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter, answers, correct_answer]);

  const checkWinner = (answer) => {
    if (answer === correct_answer) {
      props.score();
      setDisabled(true);
    } else {
      setShowCorrect(answers.indexOf(correct_answer));
      setDisabled(true);
    }
  };

  const decodeHTMLEntities = (text) => {
    var textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };
  const list = answers.map((each, index) => (
    <SingleOption
      key={each}
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
      <Text>{decodeHTMLEntities(question)}</Text>
      <Options>{list}</Options>
      <Timer color={counter < 4 ? "red" : "black"}>
        00:{counter > 9 ? counter : "0" + counter}
      </Timer>
      <Count>
        Question {props.number} of {props.questions}
      </Count>
    </Container>
  );
}
