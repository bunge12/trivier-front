import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Room = styled.span``;
const Name = styled.span``;

export default function GameInfo(props) {
  return (
    <Container>
      <Room>{props.room}</Room>
      <Name>{props.name}</Name>
    </Container>
  );
}
