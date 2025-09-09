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
  Button,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";

const menuItems = [
  { text: "Dashboard", path: "/" },
  { text: "Employees", path: "/employees" },
  { text: "Tasks", path: "/tasks" },
  { text: "Chat", path: "/chat" },
  { text: "Live Chat", path: "/live-chat" },
  { text: "Settings", path: "/settings" },
];

export default function Layout() {
  const { isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" marginLeft={14}>
            Company Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: 240 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" paddingLeft={2}>
            <hr />
            CM
            <hr />
          </Typography>
        </Toolbar>
        <List sx={{ p: 1 }}>
          {menuItems.map((item) => (
            <ListItem component={Link} to={item.path} key={item.text}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 4 }}
            onClick={logout}
          >
            Çıkış Yap
          </Button>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 30 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
