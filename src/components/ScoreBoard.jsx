import React from "react";
import styled from "styled-components";

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;
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

export default function ScoreBoard(props) {
  const listItems = props.players
    .sort((a, b) => b.score - a.score)
    .map((each, index) => (
      <Item key={index}>
        {index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : ""}
        {each.name} - {each.score}/{props.number}
      </Item>
    ));

  return <List>{listItems}</List>;
}
