import React from "react";
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";

import TextSmall from "./TextSmall";

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;
  margin-bottom: 3vh;
`;
const Item = styled.li`
  background: none;
  color: rgb(29, 54, 92);
  border: 1px solid rgb(29, 54, 92);
  padding: 0.25rem;
  border-radius: 0.5rem;
  margin: 0.25rem;
  text-align: center;
  width: 50%;
  display: inline-block;
`;
const Container = styled.div`
  text-align: center;
`;

const Button = styled.button`
  background: none;
  color: rgb(29, 54, 92);
  border: 1px solid rgb(29, 54, 92);
  padding: 0.25rem;
  border-radius: 0.5rem;
  margin: 0.25rem;
  margin-bottom: 3vh;
  text-align: center;
`;

export default function WaitingRoom(props) {
  const listItems = props.players.map((each, index) => (
    <Item key={index}>{each.name}</Item>
  ));

  return (
    <Container>
      <TextSmall text="Waiting room:"></TextSmall>
      <List>{listItems}</List>
      <TextSmall text="Invite your friends:"></TextSmall>
      <CopyToClipboard text={`https://trivier.co?room=${props.room}`}>
        <Button>Copy Link</Button>
      </CopyToClipboard>
    </Container>
  );
}
