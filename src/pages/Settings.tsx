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
  Divider,
  Avatar,
  InputAdornment,
  Paper,
  Grid,
  Switch,
  Alert,
  AlertTitle,
  useTheme,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useSettingsStore } from "../store/settingsStore";
import { useAuthStore } from "../store/useAuthStore";

const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profil", icon: <PersonIcon /> },
  { id: "appearance", label: "Görünüm", icon: <PaletteIcon /> },
  { id: "language", label: "Dil", icon: <LanguageIcon /> },
  { id: "notifications", label: "Bildirimler", icon: <NotificationsIcon /> },
  {
    id: "logout",
    label: "Çıkış Yap",
    icon: <LogoutIcon sx={{ color: "error.main" }} />,
    textProps: {
      primaryTypographyProps: { sx: { color: "error.main", fontWeight: 600 } },
    },
    onClick: (logout: () => void) => {
      if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
        logout();
      }
    },
  },
];

const Settings = () => {
  const theme = useTheme();
  const { logout } = useAuthStore();
  const {
    theme: currentTheme,
    language,
    name,
    email,
    setTheme,
    setLanguage,
    updateProfile,
  } = useSettingsStore();

  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name, email });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sound: false,
  });
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaveStatus("saving");
      await updateProfile(formData.name, formData.email);
      setSaveStatus("success");
      setIsEditing(false);

      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus("error");
    }
  };

  const handleNotificationToggle = (setting: string) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === "logout") {
      const section = SETTINGS_SECTIONS.find((s) => s.id === "logout");
      if (section?.onClick) {
        section.onClick(logout);
      }
      return;
    }
    setActiveSection(sectionId);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              maxWidth: "1200px",
              mx: "auto",
              mt: { xs: 2, md: 0 },
              mb: 4,
              backgroundColor: "background.paper",
              boxShadow: 1,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                mb={3}
                flexDirection={{ xs: "column", sm: "row" }}
                textAlign={{ xs: "center", sm: "left" }}
              >
                <Avatar
                  sx={{
                    width: { xs: 64, sm: 80 },
                    height: { xs: 64, sm: 80 },
                    bgcolor: theme.palette.primary.main,
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                    mr: { xs: 0, sm: 2 },
                    mb: { xs: 2, sm: 0 },
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {email}
                  </Typography>
                  <Chip
                    label="Premium Üye"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              {saveStatus === "success" && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <AlertTitle>Başarılı</AlertTitle>
                  Profil bilgileriniz güncellendi.
                </Alert>
              )}

              {saveStatus === "error" && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <AlertTitle>Hata</AlertTitle>
                  Bir hata oluştu. Lütfen tekrar deneyin.
                </Alert>
              )}

              <Grid container spacing={2} sx={{ px: { xs: 1, sm: 2 } }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Ad Soyad"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="E-posta"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" mt={3}>
                {isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name, email });
                      }}
                      sx={{ mr: 1 }}
                    >
                      İptal
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saveStatus === "saving"}
                      startIcon={
                        saveStatus === "saving" ? (
                          <CircularProgress size={20} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                    >
                      {saveStatus === "saving" ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Düzenle
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        );

      case "appearance":
        return (
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              height: "100%",
              backgroundColor: "#fff",
              ml: 0,
              width: "100%",
              mt: 0,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tema Ayarları
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="theme-select-label">Tema</InputLabel>
                <Select
                  labelId="theme-select-label"
                  value={currentTheme}
                  onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                  label="Tema"
                  startAdornment={
                    <InputAdornment position="start">
                      <PaletteIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="light">Açık Tema</MenuItem>
                  <MenuItem value="dark">Koyu Tema</MenuItem>
                </Select>
              </FormControl>

              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Renk Şeması
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {["#1976d2", "#9c27b0", "#2e7d32", "#d32f2f", "#ed6c02"].map(
                    (color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: color,
                          cursor: "pointer",
                          border:
                            currentTheme === color
                              ? `3px solid ${theme.palette.primary.main}`
                              : "none",
                          "&:hover": {
                            transform: "scale(1.1)",
                            transition: "transform 0.2s",
                          },
                        }}
                      />
                    )
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

      case "language":
        return (
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              height: "100%",
              backgroundColor: "#fff",
              ml: 0,
              width: "100%",
              mt: 0,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dil Tercihleri
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="language-select-label">Dil</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "tr" | "en")}
                  label="Dil"
                  startAdornment={
                    <InputAdornment position="start">
                      <LanguageIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="tr">Türkçe</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>

              <Box mt={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tarih ve Saat Formatı
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Zaman Formatı</InputLabel>
                  <Select value="24" defaultValue="24" label="Zaman Formatı">
                    <MenuItem value="24">24 Saat (14:30)</MenuItem>
                    <MenuItem value="12">12 Saat (2:30 PM)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        );

      case "notifications":
        return (
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              height: "100%",
              backgroundColor: "#fff",
              ml: 0,
              width: "100%",
              mt: 0,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bildirim Ayarları
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="E-posta Bildirimleri"
                    secondary="Önemli güncellemeler ve etkinlikler hakkında e-posta alın"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.email}
                      onChange={() => handleNotificationToggle("email")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider component="li" />

                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Anlık Bildirimler"
                    secondary="Uygulama içi anlık bildirimleri alın"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.push}
                      onChange={() => handleNotificationToggle("push")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>

                <Divider component="li" />

                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sesli Bildirimler"
                    secondary="Bildirimler için ses efekti çal"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={notifications.sound}
                      onChange={() => handleNotificationToggle("sound")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: { xs: "100%", md: 240 },
          height: { xs: "auto", md: "100vh" },
          position: { xs: "static", md: "sticky" },
          top: 0,
          borderRight: { xs: "none", md: `1px solid ${theme.palette.divider}` },
          borderBottom: {
            xs: `1px solid ${theme.palette.divider}`,
            md: "none",
          },
          p: 2,
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" sx={{ pl: 2, fontWeight: 600 }}>
          Ayarlar
        </Typography>

        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
            mt: 2,
            px: { xs: 1, sm: 2 },
          }}
        >
          <List sx={{ width: "100%" }}>
            {SETTINGS_SECTIONS.map((section) => (
              <ListItem
                button
                key={section.id}
                selected={activeSection === section.id}
                onClick={() => handleSectionClick(section.id)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  px: { xs: 1, sm: 2 },
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText
                  primary={section.label}
                  {...(section.textProps || {})}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: "100%",
          maxWidth: { md: "calc(100% - 280px)" },
          mx: "auto",
        }}
      >
        {/* Mobile Header */}
        <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
          <FormControl fullWidth>
            <Select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Select setting section" }}
            >
              {SETTINGS_SECTIONS.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  <Box display="flex" alignItems="center">
                    <Box mr={1} display="flex" alignItems="center">
                      {section.icon}
                    </Box>
                    {section.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
          {renderSection()}
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
