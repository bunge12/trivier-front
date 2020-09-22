import React, { useState } from "react";
import styled from "styled-components";

const Field = styled.input``;

export default function Join(props) {
  const [room, setRoom] = useState("3DTU");
  const searchRoom = (event) => {
    setRoom(event.target.value);
    props.callback(event.target.value);
  };
  return (
    <Field
      type="text"
      placeholder="Search by name"
      id="name-input"
      value={room}
      onChange={searchRoom}
    ></Field>
  );
}
