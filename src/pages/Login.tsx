import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCallback } from "react";

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");

  const handleLogin = useCallback(() => {
    if (username.trim() === "") {
      toast.error("Lütfen kullanıcı adınızı giriniz");
      return;
    }

    const success = login(username);
    if (success) {
      navigate("/");
    }
  }, [username, login, navigate]);

  // Available users for reference
  const availableUsers = [
    { username: "sahip1", role: "Sahip" },
    { username: "sahip2", role: "Sahip" },
    { username: "yonetici1", role: "Yönetici" },
    { username: "yonetici2", role: "Yönetici" },
    { username: "calisan1", role: "Çalışan" },
    { username: "calisan2", role: "Çalışan" },
  ];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 500,
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Kurumsal Yönetim Sistemi
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
          >
            Lütfen kullanıcı adınızla giriş yapın
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Kullanıcı Adı"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <Typography variant="body2" align="center" color="text.secondary">
              "ornekkullanici" olarak giriş yapabilirsiniz
            </Typography>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Giriş Yap
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
