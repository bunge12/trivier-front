import React from "react";
import styled from "styled-components";

const Container = styled.div`
  color: ${(props) => (props.type === "error" ? "#856404" : "#155724")};
  background-color: ${(props) =>
    props.type === "error" ? "#fff3cd" : "#d4edda"};
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  border: 1px solid transparent;
  border-color: ${(props) => (props.type === "error" ? "#ffeeba" : "#c3e6cb")};
  border-radius: 1em;
  font-size: smaller;
`;

export default function Notification(props) {
  return <Container type={props.type}>{props.text}</Container>;
}
