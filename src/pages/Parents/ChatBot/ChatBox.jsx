import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Tooltip,
  Avatar,
  Fade,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { postChatBotAsk } from "../../../services/apiServices";
import { getUserInfo } from "../../../services/handleStorageApi";
import "./ChatBox.css";
import Header from "../../../component/Header";

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
const USER_AVATAR = "https://randomuser.me/api/portraits/men/32.jpg";
const BRAND_COLOR = "#2563eb";

function getParentIdFromUser() {
  const user = getUserInfo();
  if (!user || !user.userId) return "";
  if (user.userId === "U002") return "P001";
  return "P001";
}

function MessageBubble({ from, text }) {
  return (
    <Fade in timeout={400}>
      <Box
        sx={{
          display: "flex",
          flexDirection: from === "user" ? "row-reverse" : "row",
          alignItems: "flex-end",
          mb: 1.5,
        }}
      >
        <Avatar
          src={from === "user" ? USER_AVATAR : BOT_AVATAR}
          alt={from === "user" ? "Bạn" : "AI"}
          sx={{
            width: 36,
            height: 36,
            boxShadow: 2,
            ml: from === "user" ? 2 : 0,
            mr: from === "bot" ? 2 : 0,
            bgcolor: from === "user" ? BRAND_COLOR : "#fff",
          }}
        />
        <Box
          sx={{
            px: 2,
            py: 1.2,
            borderRadius: 3,
            bgcolor: from === "user" ? BRAND_COLOR : "#fff",
            color: from === "user" ? "#fff" : "#22304a",
            boxShadow:
              from === "user" ? "0 2px 8px #2563eb33" : "0 2px 8px #e0e3e8",
            maxWidth: { xs: "80vw", sm: 340 },
            fontSize: 15.5,
            fontWeight: 500,
            wordBreak: "break-word",
            transition: "all 0.2s",
            position: "relative",
          }}
        >
          {text}
        </Box>
      </Box>
    </Fade>
  );
}

function Sidebar({
  chatHistory,
  selectedSession,
  setSelectedSession,
  handleNewSession,
  handleDeleteSession,
  handleRenameSession,
}) {
  const [editingIdx, setEditingIdx] = useState(-1);
  const [editName, setEditName] = useState("");
  return (
    <Paper
      elevation={2}
      className="chatbox-sidebar"
      sx={{ minWidth: 210, bgcolor: "#f7f8fa", borderRadius: 3, boxShadow: 3 }}
    >
      <Box className="chatbox-header" sx={{ mb: 1 }}>
        <Typography
          variant="subtitle1"
          className="chatbox-header-title"
          sx={{ fontWeight: 700, color: BRAND_COLOR }}
        >
          Lịch sử
        </Typography>
        <Tooltip title="Cuộc trò chuyện mới">
          <IconButton
            size="small"
            onClick={handleNewSession}
            className="chatbox-header-button"
            sx={{
              bgcolor: BRAND_COLOR,
              color: "#fff",
              ml: 1,
              "&:hover": { bgcolor: "#1e40af" },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider className="chatbox-divider" />
      <List
        className="chatbox-list"
        sx={{ flexGrow: 1, overflowY: "auto", pr: 0.5 }}
      >
        {chatHistory.map((session, idx) => (
          <ListItem
            button
            key={session.id}
            selected={selectedSession === idx}
            onClick={() => setSelectedSession(idx)}
            className={`chatbox-list-item ${selectedSession === idx ? "selected" : ""}`}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: selectedSession === idx ? BRAND_COLOR : "transparent",
              color: selectedSession === idx ? "#fff" : "#22304a",
              fontWeight: selectedSession === idx ? 700 : 500,
              transition: "background 0.2s, color 0.2s",
              px: 1.5,
              "&:hover": {
                bgcolor: selectedSession === idx ? BRAND_COLOR : "#e0e3e8",
              },
              display: "flex",
              alignItems: "center",
            }}
          >
            {editingIdx === idx ? (
              <TextField
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                size="small"
                autoFocus
                onBlur={() => {
                  setEditingIdx(-1);
                  setEditName("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameSession(idx, editName);
                    setEditingIdx(-1);
                    setEditName("");
                  }
                }}
                sx={{ flex: 1, mr: 1, bgcolor: "#fff", borderRadius: 1 }}
                inputProps={{ maxLength: 32 }}
              />
            ) : (
              <ListItemText
                primary={session.name}
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: 600,
                  sx: {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
                onDoubleClick={() => {
                  setEditingIdx(idx);
                  setEditName(session.name);
                }}
                sx={{ flex: 1, cursor: "pointer" }}
              />
            )}
            <Tooltip title="Đổi tên">
              <IconButton
                size="small"
                sx={{ color: "#888", ml: 0.5 }}
                onClick={() => {
                  setEditingIdx(idx);
                  setEditName(session.name);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa phiên">
              <IconButton
                size="small"
                sx={{ color: "#e11d48", ml: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSession(idx);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default function ChatBox() {
  const [chatHistory, setChatHistory] = useState([
    {
      id: Date.now(),
      name: "Phiên 1",
      messages: [
        {
          from: "bot",
          text: "Xin chào! Tôi là trợ lý giáo vụ. Rất hân hạnh được phục vụ quý phụ huynh. Cần hỗ trợ gì về thông tin học sinh, xin vui lòng cho tôi biết.",
        },
      ],
    },
  ]);
  const [selectedSession, setSelectedSession] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Khi chọn phiên khác, load lại messages
  useEffect(() => {
    setMessages([...chatHistory[selectedSession].messages]);
  }, [selectedSession, chatHistory]);

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { from: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setChatHistory((prev) => {
      const updated = [...prev];
      updated[selectedSession] = {
        ...updated[selectedSession],
        messages: newMessages,
      };
      return updated;
    });
    try {
      const parentId = localStorage.getItem("parentId");
      const res = await postChatBotAsk(parentId, input);
      console.log(parentId, input);
      const reply = res?.data?.reply || "Xin lỗi, tôi chưa hiểu ý bạn.";
      const botMsg = { from: "bot", text: reply };
      setMessages((msgs) => [...msgs, botMsg]);
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[selectedSession] = {
          ...updated[selectedSession],
          messages: [...updated[selectedSession].messages, userMsg, botMsg],
        };
        return updated;
      });
    } catch (e) {
      const botMsg = {
        from: "bot",
        text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
      };
      setMessages((msgs) => [...msgs, botMsg]);
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[selectedSession] = {
          ...updated[selectedSession],
          messages: [...updated[selectedSession].messages, userMsg, botMsg],
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // Tạo phiên chat mới
  const handleNewSession = () => {
    const newSession = {
      id: Date.now(),
      name: `Phiên ${chatHistory.length + 1}`,
      messages: [
        {
          from: "bot",
          text: "Xin chào! Tôi là trợ lý giáo vụ. Rất hân hạnh được phục vụ quý phụ huynh. Cần hỗ trợ gì về thông tin học sinh, xin vui lòng cho tôi biết.",
        },
      ],
    };
    setChatHistory([newSession, ...chatHistory]);
    setSelectedSession(0);
  };

  // Xóa phiên chat
  const handleDeleteSession = (idx) => {
    if (chatHistory.length === 1) return;
    const updated = chatHistory.filter((_, i) => i !== idx);
    setChatHistory(updated);
    setSelectedSession(0);
  };

  // Đổi tên phiên chat
  const handleRenameSession = (idx, newName) => {
    if (!newName.trim()) return;
    setChatHistory((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], name: newName.trim() };
      return updated;
    });
  };

  return (
    <>
      <Header />
      <Box className="chatbox-container" sx={{ minHeight: "70vh", gap: 2 }}>
        <Sidebar
          chatHistory={chatHistory}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          handleNewSession={handleNewSession}
          handleDeleteSession={handleDeleteSession}
          handleRenameSession={handleRenameSession}
        />
        {/* Khung chat chính */}
        <Paper
          elevation={3}
          className="chatbox-main"
          sx={{
            flex: 1,
            p: { xs: 1.5, sm: 3 },
            borderRadius: 4,
            minHeight: 480,
            display: "flex",
            flexDirection: "column",
            boxShadow: 6,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ChatIcon color="primary" />
            <Typography
              variant="h6"
              className="chatbox-title"
              sx={{ fontWeight: 700, color: BRAND_COLOR }}
            >
              Chat với A.I BOT
            </Typography>
          </Box>
          <Box
            className="chatbox-messages"
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              bgcolor: "#f7f8fa",
              borderRadius: 2,
              p: { xs: 1, sm: 2 },
            }}
          >
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} from={msg.from} text={msg.text} />
            ))}
            {loading && (
              <Fade in timeout={300}>
                <Box sx={{ display: "flex", alignItems: "flex-end", mb: 1.5 }}>
                  <Avatar
                    src={BOT_AVATAR}
                    alt="AI"
                    sx={{
                      width: 36,
                      height: 36,
                      boxShadow: 2,
                      mr: 2,
                      bgcolor: "#fff",
                    }}
                  />
                  <Box
                    sx={{
                      px: 2,
                      py: 1.2,
                      borderRadius: 3,
                      bgcolor: "#fff",
                      color: "#22304a",
                      boxShadow: "0 2px 8px #e0e3e8",
                      fontSize: 15.5,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CircularProgress size={18} color="primary" />
                    <span>Đang soạn trả lời...</span>
                  </Box>
                </Box>
              </Fade>
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box
            className="chatbox-input"
            sx={{ display: "flex", gap: 1, mt: "auto" }}
          >
            <TextField
              size="medium"
              fullWidth
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="chatbox-input-field"
              disabled={loading}
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={handleSend}
                      className="chatbox-input-button"
                      disabled={loading || !input.trim()}
                      sx={{
                        bgcolor: BRAND_COLOR,
                        color: "#fff",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#1e40af" },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                fontSize: 16,
                boxShadow: 1,
              }}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
}
