import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");

  const handleLogin = () => {
    if (username.trim() === "") return toast.error("Kullanıcı Adı Boş Olamaz");
    login(role as "sahip" | "yonetici" | "calisan");
    navigate("/");
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 20,
          p: 4,
          border: "1px solid #ccc",
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Giriş Yap
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          select
          margin="normal"
          label="Rol"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="owner">Sahip</MenuItem>
          <MenuItem value="manager">Yönetici</MenuItem>
          <MenuItem value="employee">Çalışan</MenuItem>
        </TextField>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Giriş Yap
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
