import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Avatar,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { Search, Delete, Edit, FilterList } from "@mui/icons-material";
import { deepPurple, green, blue, orange, red } from "@mui/material/colors";

const departmentColors: { [key: string]: string } = {
  IT: blue[500],
  İK: green[500],
  Finans: deepPurple[500],
  Pazarlama: orange[500],
  Satış: red[500],
};

// Rastgele avatar rengi üretme
const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

// Avatar bileşeni
const EmployeeAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar
      sx={{
        bgcolor: stringToColor(name),
        width: 56,
        height: 56,
        fontSize: "1.25rem",
        fontWeight: "bold",
      }}
    >
      {initials}
    </Avatar>
  );
};

export default function Employees() {
  const { role } = useAuthStore();
  const { employees, removeEmployee } = useEmployeeStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const departments = [...new Set(employees.map((emp) => emp.department))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !selectedDepartment || emp.department === selectedDepartment;

    if (role === "yonetici") {
      return matchesSearch && matchesDepartment && emp.department === "IT";
    } else if (role === "calisan") {
      return matchesSearch && matchesDepartment && emp.name === "Yusuf";
    }
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentColor = (dept: string) => {
    return departmentColors[dept] || deepPurple[500];
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Çalışan Yönetimi
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Toplam {filteredEmployees.length} çalışan listeleniyor
          </Typography>
        </Box>
      </Box>

      {/* Filtreleme ve Arama */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Çalışan ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth sx={{ width: "180px" }}>
                <InputLabel id="department-filter-label">
                  Departman Filtrele
                </InputLabel>
                <Select
                  labelId="department-filter-label"
                  value={selectedDepartment}
                  onChange={(e) =>
                    setSelectedDepartment(e.target.value as string)
                  }
                  label="Departman Filtrele"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="">Tüm Departmanlar</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("");
                }}
                sx={{ borderRadius: 3, py: 1.5 }}
              >
                Sıfırla
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Çalışan Listesi */}
      <Grid container spacing={3}>
        {filteredEmployees.map((emp) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <EmployeeAvatar name={emp.name} />
                  <Box ml={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {emp.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {emp.department} Departmanı
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Chip
                    label={emp.department || "Belirtilmemiş"}
                    size="small"
                    sx={{
                      bgcolor: `${getDepartmentColor(emp.department)}15`,
                      color: getDepartmentColor(emp.department),
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  />
                  <Chip
                    label={emp.role === "yönetici" ? "Yönetici" : "Çalışan"}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1, fontWeight: "medium" }}
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Projeler
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {emp.projects || 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (emp.projects || 0) * 10)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      mb: 1.5,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "primary.main",
                        borderRadius: 3,
                      },
                    }}
                  />

                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Görevler
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {emp.tasks || 0}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (emp.tasks || 0) * 5)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "secondary.main",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" color="text.secondary">
                    {emp.role === "yönetici" ? "Yönetici" : "Çalışan"}
                  </Typography>
                  {role === "sahip" ? (
                    <Box>
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeEmployee(emp.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : null}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
