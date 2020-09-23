import React from "react";
import styled from "styled-components";

const Styled = styled.button``;

export default function Button(props) {
  return <Styled onClick={props.callback}>{props.text}</Styled>;
}
