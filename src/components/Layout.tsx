import { Navigate, Outlet, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import Logo from "../images/logo-ai.png";

const menuItems = [
  { text: "Dashboard", path: "/" },
  { text: "Çalışanlar", path: "/employees" },
  { text: "Görevler", path: "/tasks" },
  { text: "Sohbet", path: "/chat" },
  { text: "Canlı Sohbet", path: "/live-chat" },
  { text: "Ayarlar", path: "/settings" },
];

export default function Layout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ bgcolor: "#000" }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" marginLeft={17}>
            Company Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: 130 }}>
        <Toolbar>
          <img src={Logo} alt="Logo" width={100} />
        </Toolbar>
        <List sx={{ p: 1 }}>
          {menuItems.map((item) => (
            <ListItem component={Link} to={item.path} key={item.text}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pl: 1, height: "100%" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
