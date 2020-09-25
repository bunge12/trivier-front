import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1vh;
  margin-bottom: 1vh;
  color: #0075c7;
`;

const Item = styled.span`
  font-weight: 600;
  color: #0075c7;
`;

export default function GameInfo(props) {
  return (
    <Container>
      <Item>Room Code: {props.room}</Item>
      {/* <Item>{props.name}</Item> */}
    </Container>
  );
}
