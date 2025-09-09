import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";

export default function Tasks() {
  const { role } = useAuthStore();
  const { tasks, addTask, updateTask, removeTask } = useTaskStore();

  // yeni görev ekleme state
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // rol bazlı filtre
  const filteredTasks =
    role === "owner"
      ? tasks
      : role === "manager"
      ? tasks.filter((t) => t.assignedTo !== "Owner") // örnek mantık
      : tasks.filter((t) => t.assignedTo === "Ayşe Demir"); // employee için örnek kullanıcı

  const handleAdd = () => {
    if (title.trim() === "" || assignedTo.trim() === "") return;
    addTask({ title, assignedTo, status: "pending" });
    setTitle("");
    setAssignedTo("");
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>

      {/* Sadece Manager görev ekleyebilir */}
      {role === "manager" && (
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Görev Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Atanan Kişi"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd}>
            Ekle
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} md={4} key={task.id}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="text.secondary">
                  Atanan: {task.assignedTo}
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Durum</InputLabel>
                  <Select
                    value={task.status}
                    label="Durum"
                    onChange={(e) => updateTask(task.id, e.target.value as any)}
                    disabled={role === "employee"} // employee kendi görevini değiştiremesin
                  >
                    <MenuItem value="pending">Bekliyor</MenuItem>
                    <MenuItem value="in-progress">Devam Ediyor</MenuItem>
                    <MenuItem value="done">Tamamlandı</MenuItem>
                  </Select>
                </FormControl>
                {role === "manager" && (
                  <Button
                    color="error"
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => removeTask(task.id)}
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
