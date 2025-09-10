import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useState } from "react";

export default function Employees() {
  const { role } = useAuthStore();
  const { employees, addEmployee, removeEmployee } = useEmployeeStore();

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");

  const filteredEmployees =
    role === "owner"
      ? employees
      : role === "manager"
      ? employees.filter((emp) => emp.department === "IT")
      : employees.filter((emp) => emp.name === "Yusuf");

  const handleAdd = () => {
    if (name.trim() === "" || department.trim() === "") return;
    addEmployee({ name, role: "employee", department });
    setName("");
    setDepartment("");
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Çalışanlar
      </Typography>

      {role === "owner" && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="İsim"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Departman"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd}>
            Ekle
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredEmployees.map((emp) => (
          <Grid item xs={12} md={4} key={emp.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" textAlign="center">
                  {emp.name}
                </Typography>
                <hr />
                <Typography color="text.secondary">
                  {emp.role.toUpperCase()} - {emp.department}
                </Typography>
                {role === "owner" && (
                  <Button
                    color="error"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => removeEmployee(emp.id)}
                  >
                    Sil
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
