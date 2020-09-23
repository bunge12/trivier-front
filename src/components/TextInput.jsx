import React, { useState } from "react";
import styled from "styled-components";

const Field = styled.input``;

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
