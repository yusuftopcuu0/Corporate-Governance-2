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

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");

  const handleLogin = () => {
    if (username.trim() === "") return;
    login(role as "owner" | "manager" | "employee");
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
          Login
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          select
          margin="normal"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="owner">Owner</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="employee">Employee</MenuItem>
        </TextField>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
