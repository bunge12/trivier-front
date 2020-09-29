import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Option = styled.button`
  background: none;
  padding: 1em;
  border: 1px solid #0075c7;
  border-radius: 1em;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  color: #0075c7;
  width: 40%;
  :focus {
    outline: none;
  }
  @media only screen and (min-width: 1200px) {
    font-size: larger;
    font-weight: bold;
  }
`;
const Wrong = styled.button`
  background: rgb(235, 129, 130);
  border: 1px solid rgb(235, 129, 130);
  padding: 1em;
  border-radius: 1em;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  color: white;
  width: 40%;
  font-weight: bold;
  :focus {
    outline: none;
  }
  @media only screen and (min-width: 1200px) {
    font-size: larger;
    font-weight: bold;
  }
`;
const Correct = styled.button`
  background: rgb(95, 192, 136);
  padding: 1em;
  border: 1px solid rgb(95, 192, 136);
  border-radius: 1em;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  color: white;
  width: 40%;
  font-weight: bold;
  :focus {
    outline: none;
  }
  @media only screen and (min-width: 1200px) {
    font-size: larger;
    font-weight: bold;
  }
`;

export default function SingleOption(props) {
  const [status, setStatus] = useState(0); // 0 = not answered, 1 = correct, 2 = incorrect
  const decodeHTMLEntities = (text) => {
    var textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };
  const text = decodeHTMLEntities(props.text);
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
          {text}
        </Option>
      )}
      {status === 1 && (
        <Correct onClick={check} disabled={props.disabled}>
          {text}
        </Correct>
      )}
      {status === 2 && (
        <Wrong onClick={check} disabled={props.disabled}>
          {text}
        </Wrong>
      )}
    </>
  );
}
