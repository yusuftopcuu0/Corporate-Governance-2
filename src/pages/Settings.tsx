import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useSettingsStore } from "../store/settingsStore";

const Settings = () => {
  const { theme, language, name, email, setTheme, setLanguage, updateProfile } =
    useSettingsStore();

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);

  const handleSave = () => {
    updateProfile(newName, newEmail);
    alert("Profil Güncellendi!");
  };

  return (
    <Box display="flex" justifyContent="center">
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          borderRadius: 3,
          boxShadow: 5,
          p: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Ayarlar
          </Typography>

          {/* Profil */}
          <Typography variant="h6" mt={2}>
            Profil
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 1 }}
          >
            Profili Güncelle
          </Button>

          {/* Tema */}
          <Typography variant="h6" mt={4}>
            Görünüm
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Theme</InputLabel>
            <Select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
            >
              <MenuItem value="light">Açık</MenuItem>
              <MenuItem value="dark">Koyu</MenuItem>
            </Select>
          </FormControl>

          {/* Dil */}
          <Typography variant="h6" mt={4}>
            Dil
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Dil</InputLabel>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "tr" | "en")}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="tr">Türkçe</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
