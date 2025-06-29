import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import "./ChatBox.css";

export default function ChatBox() {
  // Lịch sử trò chuyện mẫu
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      name: "Phiên 1",
      messages: [
        { from: "bot", text: "Xin chào! Tôi là A.I BOT, bạn cần hỗ trợ gì?" },
        { from: "user", text: "Tôi muốn xem lịch học tuần này." },
        { from: "bot", text: "Bạn học lớp nào?" },
        { from: "user", text: "Lớp FPT SIÊU VIỆT BẤY BÌ" },
        { from: "bot", text: "Đây là lịch học tuần này cho lớp SWD..." },
      ],
    },
    {
      id: 2,
      name: "Phiên 2",
      messages: [
        { from: "bot", text: "Xin chào! Tôi là A.I BOT, bạn cần hỗ trợ gì?" },
        { from: "user", text: "Điểm kiểm tra giữa kỳ đã có chưa?" },
        { from: "bot", text: "Điểm đã được cập nhật trên hệ thống." },
      ],
    },
  ]);
  const [selectedSession, setSelectedSession] = useState(0);
  const [messages, setMessages] = useState([...chatHistory[0].messages]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Khi chọn phiên khác, load lại messages
  useEffect(() => {
    setMessages([...chatHistory[selectedSession].messages]);
  }, [selectedSession]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    // Cập nhật vào lịch sử
    setChatHistory((prev) => {
      const updated = [...prev];
      updated[selectedSession] = {
        ...updated[selectedSession],
        messages: newMessages,
      };
      return updated;
    });
  };

  const handleNewSession = () => {
    const newSession = {
      id: Date.now(),
      name: `Phiên ${chatHistory.length + 1}`,
      messages: [
        { from: "bot", text: "Xin chào! Tôi là A.I BOT, bạn cần hỗ trợ gì?" },
      ],
    };
    setChatHistory([newSession, ...chatHistory]);
    setSelectedSession(0);
  };

  return (
    <Box className="chatbox-container">
      {/* Sidebar lịch sử */}
      <Paper elevation={1} className="chatbox-sidebar">
        <Box className="chatbox-header">
          <Typography variant="subtitle1" className="chatbox-header-title">
            Lịch sử
          </Typography>
          <IconButton
            size="small"
            onClick={handleNewSession}
            className="chatbox-header-button"
            title="Cuộc trò chuyện mới"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider className="chatbox-divider" />
        <List className="chatbox-list">
          {chatHistory.map((session, idx) => (
            <ListItem
              button
              key={session.id}
              selected={selectedSession === idx}
              onClick={() => setSelectedSession(idx)}
              className={`chatbox-list-item ${selectedSession === idx ? "selected" : ""}`}
            >
              <ListItemText
                primary={session.name}
                primaryTypographyProps={{ fontSize: 15, fontWeight: 600 }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      {/* Khung chat chính */}
      <Paper elevation={2} className="chatbox-main">
        <Typography variant="h6" className="chatbox-title">
          Chat với A.I BOT
        </Typography>
        <Box className="chatbox-messages">
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              className={`chatbox-message ${msg.from === "user" ? "user" : "bot"}`}
            >
              <Box
                className={`chatbox-message-content ${msg.from === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box className="chatbox-input">
          <TextField
            size="small"
            fullWidth
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="chatbox-input-field"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            className="chatbox-input-button"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
