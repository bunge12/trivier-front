import React from "react";
import styled from "styled-components";

const Styled = styled.button`
  background: none;
  padding: 1em;
  border: 1px solid #0075c7;
  border-radius: 1em;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  color: #0075c7;
  width: 50%;
`;

export default function Button(props) {
  return <Styled onClick={props.callback}>{props.text}</Styled>;
}
