import React from "react";
import styled from "styled-components";

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;
const Item = styled.li``;

export default function ScoreBoard(props) {
  const listItems = props.players
    .sort((a, b) => b.score - a.score)
    .map((each, index) => (
      <Item key={index}>
        {each.name} {each.score}
      </Item>
    ));

  return <List>{listItems}</List>;
}
