import React, { useState } from "react";
import styled from "styled-components";

const Field = styled.input`
  background: none;
  padding: 1em;
  border: 1px solid #0075c7;
  border-radius: 1em;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  color: #0075c7;
  width: 50%;
  :focus {
    outline: none;
  }
`;

export default function TextInput(props) {
  const [value, setValue] = useState("");
  const saveValue = (event) => {
    setValue(event.target.value);
    props.callback(event.target.value);
  };
  return (
    <Field
      type="text"
      placeholder={props.placeholder}
      value={value}
      onChange={saveValue}
    ></Field>
  );
}
