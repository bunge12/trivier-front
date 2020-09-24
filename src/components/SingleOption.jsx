import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Option = styled.button`
  background: white;
  padding: 1.5vh;
  border: 1px solid black;
  border-radius: 5%;
  margin-top: 1.5vh;
  color: black;
`;
const Wrong = styled.button`
  background: red;
  padding: 1.5vh;
  border: 1px solid black;
  border-radius: 5%;
  margin-top: 1.5vh;
  color: white;
`;
const Correct = styled.button`
  background: green;
  padding: 1.5vh;
  border: 1px solid black;
  border-radius: 5%;
  margin-top: 1.5vh;
  color: white;
`;

export default function SingleOption(props) {
  const [status, setStatus] = useState(0); // 0 = not answered, 1 = correct, 2 = incorrect
  useEffect(() => {
    if (props.showCorrect === props.answerIndex) {
      setStatus(1);
    }
  }, [props.showCorrect, props.answerIndex]);
  const check = (event) => {
    props.callback(event.target.innerText);
    if (event.target.innerText === props.winner) {
      setStatus(1);
    } else {
      setStatus(2);
    }
  };
  return (
    <>
      {status === 0 && (
        <Option onClick={check} disabled={props.disabled}>
          {props.text}
        </Option>
      )}
      {status === 1 && (
        <Correct onClick={check} disabled={props.disabled}>
          {props.text}
        </Correct>
      )}
      {status === 2 && (
        <Wrong onClick={check} disabled={props.disabled}>
          {props.text}
        </Wrong>
      )}
    </>
  );
}
