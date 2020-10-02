import React from "react";
import styled from "styled-components";

const Text = styled.div`
  font-size: small;
  text-align: center;
`;

export default function TestSmall(props) {
  return <Text>{props.text}</Text>;
}
