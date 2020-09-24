import React from "react";
import styled from "styled-components";

const Styled = styled.button`
  background: white;
  padding: 1.5vh;
  border: 1px solid black;
  border-radius: 5%;
  margin-top: 0.5vh;
`;

export default function Button(props) {
  return <Styled onClick={props.callback}>{props.text}</Styled>;
}
