import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";

const Layout = ({ children, ...props }) => {
  const { isHeaderVisible } = useGlobalState();

  return (
    <Container>
      {
        isHeaderVisible && <Header />
      }
      {children}
    </Container>
  );
}

export default Layout;