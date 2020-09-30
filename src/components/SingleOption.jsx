import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Option = styled.button`
  background: ${(props) =>
    props.type === "wrong"
      ? "rgb(235, 129, 130)"
      : props.type === "correct"
      ? "rgb(95, 192, 136)"
      : "none"};
  border: ${(props) =>
    props.type === "wrong"
      ? "1px solid rgb(235, 129, 130)"
      : props.type === "correct"
      ? "1px solid rgb(95, 192, 136)"
      : "1px solid #0075c7"};
  color: ${(props) =>
    props.type === "wrong"
      ? "white"
      : props.type === "correct"
      ? "white"
      : "#0075c7"};
  padding: 1em;
  border-radius: 1em;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  width: 40%;
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
        <Option type="correct" onClick={check} disabled={props.disabled}>
          {text}
        </Option>
      )}
      {status === 2 && (
        <Option type="wrong" onClick={check} disabled={props.disabled}>
          {text}
        </Option>
      )}
    </>
  );
}
