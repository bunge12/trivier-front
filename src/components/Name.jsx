import React, { useState } from "react";
import styled from "styled-components";

const Field = styled.input``;

export default function Name(props) {
  const [name, setName] = useState("");
  const saveName = (event) => {
    setName(event.target.value);
    props.callback(event.target.value);
  };
  return (
    <Field
      type="text"
      placeholder="Enter name"
      id="name-input"
      value={name}
      onChange={saveName}
    ></Field>
  );
}
