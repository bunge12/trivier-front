import React from "react";
import styled from "styled-components";

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;
const Item = styled.li``;

export default function WaitingRoom(props) {
  const listItems = props.players.map((each, index) => (
    <Item key={index}>{each.name}</Item>
  ));

  return <List>{listItems}</List>;
}
