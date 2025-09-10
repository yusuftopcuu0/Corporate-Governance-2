import { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Badge,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  AttachFile as AttachFileIcon,
  Mood as MoodIcon,
  MoreVert as MoreVertIcon,
  Videocam as VideocamIcon,
  Call as CallIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEmployeeStore } from "../store/useEmployeeStore";

// Generate color from string for avatar
const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

// User avatar component with online status
const UserAvatar = ({
  name,
  isOnline = false,
}: {
  name: string;
  isOnline?: boolean;
}) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      color="success"
      invisible={!isOnline}
    >
      <Avatar
        sx={{
          bgcolor: stringToColor(name),
          width: 40,
          height: 40,
          fontSize: "0.875rem",
        }}
      >
        {initials}
      </Avatar>
    </Badge>
  );
};

const Chat = () => {
  const theme = useTheme();
  const { role, userName } = useAuthStore();
  const { messages, addMessage } = useChatStore();
  const { employees } = useEmployeeStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 900);
  const [showUserList, setShowUserList] = useState(true);

  // Kullanıcı listesi rol bazlı - useMemo ile optimize edildi
  const users = useMemo(() => {
    if (role === "sahip") {
      return [
        ...new Set([...employees.map((e) => e.name), "Tüm Kullanıcılar"]),
      ];
    } else if (role === "yonetici") {
      return [
        ...new Set([
          ...employees.filter((e) => e.department === "IT").map((e) => e.name),
          "Tüm Kullanıcılar",
        ]),
      ];
    }
    return ["Yönetici"]; // Çalışan sadece yöneticisini görsün
  }, [role, employees]);

  // Set first user as selected on initial load
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 900;
      setIsMobileView(isMobile);
      if (!isMobile) {
        setShowUserList(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim() || !selectedUser || !role) return;

    // Eğer "Tüm Kullanıcılar" seçiliyse, tüm kullanıcılara gönder
    if (selectedUser === "Tüm Kullanıcılar") {
      const recipients = users.filter(
        (u) => u !== "Tüm Kullanıcılar" && u !== userName
      );
      recipients.forEach((recipient) => {
        addMessage(userName, recipient, input);
      });
    } else {
      addMessage(userName, selectedUser, input);
    }

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filtrelenmiş mesajlar
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === selectedUser && msg.receiver === userName) ||
      (msg.sender === userName && msg.receiver === selectedUser) ||
      (selectedUser === "Tüm Kullanıcılar" &&
        (msg.receiver === "Tüm Kullanıcılar" || msg.sender === userName))
  );

  // Kullanıcının son mesajını al
  const getLastMessage = (user: string) => {
    const userMessages = messages.filter(
      (msg) =>
        (msg.sender === user && msg.receiver === userName) ||
        (msg.sender === userName && msg.receiver === user)
    );
    return userMessages[userMessages.length - 1];
  };

  // Filtrelenmiş kullanıcılar
  const filteredUsers = users.filter(
    (user) =>
      user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user === "Tüm Kullanıcılar"
  );

  // Okunmamış mesaj sayıları
  const unreadCounts = users.reduce((acc, user) => {
    if (user === userName) return acc;
    const count = messages.filter(
      (msg) => msg.receiver === userName && msg.sender === user && !msg.read
    ).length;
    return { ...acc, [user]: count };
  }, {} as Record<string, number>);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* User list */}
        <Box
          sx={{
            width: isMobileView ? (showUserList ? "100%" : 0) : 350,
            borderRight: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            transition: "all 0.3s ease",
            overflow: "hidden",
            position: isMobileView ? "absolute" : "relative",
            left: isMobileView ? (showUserList ? 0 : "-100%") : 0,
            zIndex: 2,
            height: "100%",
          }}
        >
          <Card
            sx={{
              borderRadius: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {isMobileView && (
                  <IconButton
                    onClick={() => setShowUserList(false)}
                    sx={{ mr: 1 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sohbetler
                </Typography>
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor:
                      theme.palette.mode === "light" ? "#f5f5f5" : "#2d2d2d",
                  },
                }}
              />
              <List
                sx={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
              >
                {filteredUsers.map((user) => (
                  <ListItem
                    key={user}
                    component="div"
                    selected={user === selectedUser}
                    onClick={() => {
                      setSelectedUser(user);
                      if (isMobileView) setShowUserList(false);
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      cursor: "pointer",
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.action.selected,
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      },
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <UserAvatar
                        name={user}
                        isOnline={user !== "Tüm Kullanıcılar"}
                      />
                    </ListItemAvatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{
                            fontWeight:
                              unreadCounts[user] > 0 ? "bold" : "normal",
                            color:
                              unreadCounts[user] > 0
                                ? theme.palette.primary.main
                                : "inherit",
                          }}
                        >
                          {user}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {getLastMessage(user)?.timestamp &&
                            format(
                              new Date(getLastMessage(user).timestamp),
                              "HH:mm"
                            )}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        noWrap
                        sx={{
                          fontSize: "0.8rem",
                          color:
                            unreadCounts[user] > 0
                              ? theme.palette.primary.main
                              : "inherit",
                        }}
                      >
                        {getLastMessage(user)?.text || "Henüz mesaj yok"}
                      </Typography>
                    </Box>
                    {unreadCounts[user] > 0 && (
                      <Box
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: "white",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          ml: 1,
                        }}
                      >
                        {unreadCounts[user]}
                      </Box>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Chat area */}
        {selectedUser && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              position: "relative",
              ...(isMobileView && showUserList && { display: "none" }),
            }}
          >
            <Card
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                borderRadius: 0,
                boxShadow: "none",
                borderLeft: `1px solid ${theme.palette.divider}`,
                height: "100%",
              }}
            >
              {/* Chat header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "background.paper",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {isMobileView && (
                    <IconButton
                      onClick={() => setShowUserList(true)}
                      sx={{ mr: 1, display: { xs: "flex", md: "none" } }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  <UserAvatar
                    name={selectedUser}
                    isOnline={selectedUser !== "Tüm Kullanıcılar"}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {selectedUser}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedUser === "Tüm Kullanıcılar"
                        ? "Çevrimiçi"
                        : "Son görülme: Az önce"}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Tooltip title="Sesli arama">
                    <IconButton>
                      <CallIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Görüntülü arama">
                    <IconButton>
                      <VideocamIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Daha fazla">
                    <IconButton>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 2,
                  bgcolor:
                    theme.palette.mode === "light"
                      ? "rgba(0, 0, 0, 0.02)"
                      : "rgba(255, 255, 255, 0.05)",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-.895-3-2-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                }}
              >
                {filteredMessages.length === 0 ? (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      color: "text.secondary",
                      p: 3,
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/empty-chat.svg"
                      alt="No messages"
                      sx={{ width: 200, mb: 2, opacity: 0.7 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Henüz mesaj yok
                    </Typography>
                    <Typography variant="body2">
                      {selectedUser === "Tüm Kullanıcılar"
                        ? "Grup sohbetine hoş geldiniz! Buradan tüm üyelere mesaj gönderebilirsiniz."
                        : `@${selectedUser} ile sohbet başlatın!`}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    {filteredMessages.map((msg, index) => {
                      const isCurrentUser = msg.sender === userName;
                      const showAvatar =
                        index === 0 ||
                        filteredMessages[index - 1]?.sender !== msg.sender;

                      return (
                        <Box
                          key={msg.id}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isCurrentUser
                              ? "flex-end"
                              : "flex-start",
                            "&:hover": {
                              "& .message-time": {
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-end",
                              gap: 1,
                              maxWidth: "80%",
                              flexDirection: isCurrentUser
                                ? "row-reverse"
                                : "row",
                            }}
                          >
                            {!isCurrentUser && showAvatar && (
                              <Box sx={{ alignSelf: "flex-end", mb: "auto" }}>
                                <UserAvatar name={msg.sender} isOnline={true} />
                              </Box>
                            )}
                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 4,
                                bgcolor: isCurrentUser
                                  ? theme.palette.primary.main
                                  : theme.palette.grey[200],
                                color: isCurrentUser ? "#fff" : "text.primary",
                                position: "relative",
                                borderTopLeftRadius: isCurrentUser ? 16 : 4,
                                borderTopRightRadius: isCurrentUser ? 4 : 16,
                                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              }}
                            >
                              {!isCurrentUser && showAvatar && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    fontWeight: "bold",
                                    mb: 0.5,
                                    color: isCurrentUser
                                      ? "rgba(255,255,255,0.9)"
                                      : theme.palette.primary.main,
                                  }}
                                >
                                  {msg.sender}
                                </Typography>
                              )}
                              <Typography
                                variant="body2"
                                sx={{ wordBreak: "break-word" }}
                              >
                                {msg.text}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  mt: 0.5,
                                  gap: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  className="message-time"
                                  sx={{
                                    fontSize: "0.65rem",
                                    opacity: 0.7,
                                    transition: "opacity 0.2s",
                                    color: isCurrentUser
                                      ? "rgba(255,255,255,0.8)"
                                      : "text.secondary",
                                  }}
                                >
                                  {format(new Date(msg.timestamp), "HH:mm")}
                                </Typography>
                                {isCurrentUser && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      ml: 0.5,
                                    }}
                                  >
                                    {msg.read ? (
                                      <CheckCircleIcon
                                        sx={{
                                          fontSize: "1rem",
                                          color: "#4CAF50",
                                        }}
                                      />
                                    ) : (
                                      <CheckIcon
                                        sx={{
                                          fontSize: "0.8rem",
                                          opacity: 0.7,
                                        }}
                                      />
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </Box>
                )}
              </Box>

              {/* Message input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  bgcolor: "background.paper",
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Dosya ekle">
                      <IconButton>
                        <AttachFileIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Emoji ekle">
                      <IconButton>
                        <MoodIcon />
                      </IconButton>
                    </Tooltip>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder={`${selectedUser} ile mesajlaşın...`}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      multiline
                      maxRows={4}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 4,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "rgba(0, 0, 0, 0.04)"
                              : "rgba(255, 255, 255, 0.08)",
                          "& fieldset": {
                            border: "none",
                          },
                        },
                      }}
                    />
                    <Tooltip title="Gönder">
                      <span>
                        <IconButton
                          type="submit"
                          color="primary"
                          disabled={!input.trim()}
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            color: "#fff",
                            "&:hover": {
                              bgcolor: theme.palette.primary.dark,
                            },
                            "&.Mui-disabled": {
                              bgcolor: theme.palette.action.disabledBackground,
                              color: theme.palette.action.disabled,
                            },
                          }}
                        >
                          <SendIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </form>
              </Box>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
