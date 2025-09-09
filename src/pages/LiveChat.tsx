import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useChatBotStore } from "../store/chatBotStore";

export default function LiveChat() {
  const { messages, sendMessage } = useChatBotStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };
  return (
    <Box p={3}>
      <Box>
        <Typography variant="h4" justifyContent={"center"}>
          Live Chat
        </Typography>
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            boxShadow: 5,
          }}
        >
          <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
            <List>
              {messages.map((msg) => (
                <ListItem
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor:
                        msg.sender === "user" ? "primary.main" : "grey.300",
                      color: msg.sender === "user" ? "white" : "black",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: "70%",
                    }}
                  >
                    <Typography>{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", textAlign: "right" }}
                    >
                      {msg.timestamp}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </CardContent>
          <Box display="flex" p={2} borderTop="1px solid #ddd">
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}>
              <SendIcon />
            </IconButton>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
