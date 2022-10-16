import { Center } from "@mantine/core";
import Explorer from "components/translate/Explorer";
import { css } from "styled-components";

export default function Index() {
  return (
    <Center
      css={css`
        height: 100%;
      `}
    >
      <Explorer />
    </Center>
  );
}
