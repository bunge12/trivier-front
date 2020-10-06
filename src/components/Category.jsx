import React from "react";
import styled from "styled-components";

const Select = styled.select`
  font-size: 16px;
`;

export default function Category(props) {
  const options = props.data.trivia_categories.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));
  return <Select>{options}</Select>;
}
