import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Videocam as VideocamIcon,
  Call as CallIcon,
  CheckCircle as CheckCircleIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { format } from 'date-fns';
import { useChatBotStore } from "../store/chatBotStore";

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
const UserAvatar = ({ name, isOnline = false }: { name: string; isOnline?: boolean }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      color="success"
      invisible={!isOnline}
    >
      <Avatar
        sx={{
          bgcolor: stringToColor(name),
          width: 40,
          height: 40,
          fontSize: '0.875rem',
        }}
      >
        {name === 'AI' ? 
          <BotIcon /> : 
          <PersonIcon />
        }
      </Avatar>
    </Badge>
  );
};

export default function LiveChat() {
  const theme = useTheme();
  const { messages, sendMessage } = useChatBotStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, setIsMobileView] = useState(window.innerWidth < 900);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.palette.background.default,
      p: 3
    }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
        Canlı Sohbet
      </Typography>
      
      <Card 
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          boxShadow: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        {/* Chat header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <UserAvatar name="AI" isOnline={true} />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                AI Asistan
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Çevrimiçi
              </Typography>
            </Box>
          </Box>
          <Box>
            <Tooltip title="Sesli arama">
              <IconButton>
                <CallIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Video arama">
              <IconButton>
                <VideocamIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Messages */}
        <Box 
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            bgcolor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.02)' 
              : 'rgba(255, 255, 255, 0.05)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'text.secondary',
                p: 3
              }}
            >
              <UserAvatar name="AI" isOnline={true} />
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Size nasıl yardımcı olabilirim?
              </Typography>
              <Typography variant="body2">
                Sorularınızı yanıtlamak için buradayım. Bana her şeyi sorabilirsiniz.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                const showAvatar = index === 0 || messages[index - 1]?.sender !== msg.sender;
                
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      '&:hover': {
                        '& .message-time': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 1,
                        maxWidth: '80%',
                        flexDirection: isUser ? 'row-reverse' : 'row',
                      }}
                    >
                      {!isUser && showAvatar && (
                        <Box sx={{ alignSelf: 'flex-end', mb: 'auto' }}>
                          <UserAvatar name="AI" isOnline={true} />
                        </Box>
                      )}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 4,
                          bgcolor: isUser 
                            ? theme.palette.primary.main 
                            : theme.palette.grey[200],
                          color: isUser ? '#fff' : 'text.primary',
                          position: 'relative',
                          borderTopLeftRadius: isUser ? 16 : 4,
                          borderTopRightRadius: isUser ? 4 : 16,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {msg.text}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            mt: 0.5,
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            className="message-time"
                            sx={{
                              fontSize: '0.65rem',
                              opacity: 0.7,
                              transition: 'opacity 0.2s',
                              color: isUser ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                            }}
                          >
                            {format(new Date(msg.timestamp || new Date()), 'HH:mm')}
                          </Typography>
                          {isUser && (
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                              <CheckCircleIcon sx={{ fontSize: '1rem', color: '#4CAF50' }} />
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
            bgcolor: 'background.paper',
          }}
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Dosya ekle">
                <IconButton>
                  <AttachFileIcon />
                </IconButton>
              </Tooltip>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Mesajınızı yazın..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    bgcolor: theme.palette.mode === 'light' 
                      ? 'rgba(0, 0, 0, 0.04)' 
                      : 'rgba(255, 255, 255, 0.08)',
                    '& fieldset': {
                      border: 'none',
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
                      color: '#fff',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                      '&.Mui-disabled': {
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
  );
}
