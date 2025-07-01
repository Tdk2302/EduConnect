import React from "react";
import { Box } from "@mui/material";
import Header from "../../../component/Header";
import ChatBox from "./ChatBox";

const ChatBotPage = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 80px)",
          padding: "20px",
          background: "#f5f5f5",
        }}
      >
        <ChatBox />
      </Box>
    </>
  );
};

export default ChatBotPage;
