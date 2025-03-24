import React from "react";
import Container from "@mui/material/Container";

import Header from "./Header";
import Content from "./Content";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ToastContainer";
function App() {
  return (
    <ToastProvider>
      <Header />
      <Container>
        <Content />
      </Container>
      <ToastContainer />
    </ToastProvider>
  );
}

export default App;
