import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEmployeeStore } from "../store/useEmployeeStore";

const Chat = () => {
  const { role, userName } = useAuthStore();
  const { messages, addMessage } = useChatStore();
  const { employees } = useEmployeeStore();

  // Kullanıcı listesi rol bazlı
  const users =
    role === "owner"
      ? employees.map((e) => e.name)
      : role === "manager"
      ? employees.filter((e) => e.department === "IT").map((e) => e.name)
      : ["ManagerUser"]; // employee → sadece yöneticisini görsün

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(userName, selectedUser, input);
    setInput("");
  };

  // sadece ilgili konuşma
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === userName && msg.receiver === selectedUser) ||
      (msg.sender === selectedUser && msg.receiver === userName)
  );

  return (
    <Box display="flex" justifyContent="center" p={3}>
      {/* Kullanıcı listesi */}
      <Box sx={{ width: 200, mr: 2 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom textAlign="center">
              Users
            </Typography>
            <hr />
            <List>
              {users.map((user) => (
                <ListItem
                  key={user}
                  button
                  selected={user === selectedUser}
                  onClick={() => setSelectedUser(user)}
                >
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Sohbet ekranı */}

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
        <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
          {selectedUser}
        </Typography>
        <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>
            {filteredMessages.map((msg) => (
              <ListItem
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === userName ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    bgcolor:
                      msg.sender === userName ? "primary.main" : "grey.300",
                    color: msg.sender === userName ? "white" : "black",
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
          </List>
        </CardContent>

        {/* Mesaj yazma alanı */}
        <Box display="flex" p={2} borderTop="1px solid #ddd">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder={`Message ${selectedUser}`}
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
  );
};

export default Chat;
