import React from "react";
import styled from "styled-components";
import {
  TelegramShareButton,
  ViberShareButton,
  WhatsappShareButton,
} from "react-share";
import { TelegramIcon, ViberIcon, WhatsappIcon } from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MobileView } from "react-device-detect";

import TextSmall from "./TextSmall";

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: center;
  margin-bottom: 3vh;
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
const Container = styled.div`
  text-align: center;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 50%;
  margin: 0px auto;
  margin-bottom: 2vh;
  margin-top: 0.5vh;
`;
const Button = styled.button`
  background: none;
  color: rgb(29, 54, 92);
  border: 1px solid rgb(29, 54, 92);
  padding: 0.25rem;
  border-radius: 0.5rem;
  margin: 0.25rem;
  text-align: center;
`;

export default function WaitingRoom(props) {
  const listItems = props.players.map((each, index) => (
    <Item key={index}>{each.name}</Item>
  ));

  return (
    <Container>
      <TextSmall text="Waiting room:"></TextSmall>
      <List>{listItems}</List>
      <TextSmall text="Invite your friends:"></TextSmall>
      <CopyToClipboard text={`https://trivier.co?room=${props.room}`}>
        <Button>Copy Link</Button>
      </CopyToClipboard>
      <MobileView>
        <Row>
          <TelegramShareButton url={`https://trivier.co?room=${props.room}`}>
            <TelegramIcon size={32} round={true} />
          </TelegramShareButton>
          <ViberShareButton url={`https://trivier.co?room=${props.room}`}>
            <ViberIcon size={32} round={true} />
          </ViberShareButton>
          <WhatsappShareButton url={`https://trivier.co?room=${props.room}`}>
            <WhatsappIcon size={32} round={true} />
          </WhatsappShareButton>
        </Row>
      </MobileView>
    </Container>
  );
}
