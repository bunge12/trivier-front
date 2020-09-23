import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Room from "../components/Room";
import Name from "../components/Name";

storiesOf("App", module)
  .add("Room Search Field", () => <Room callback={action()} />)
  .add("Name Add Field", () => <Name callback={action()} />);
