import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  Avatar,
  LinearProgress,
  FormControl,
  InputLabel,
  Tooltip,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Add, 
  CheckCircle, 
  Pending, 
  AccessTime, 
  Delete, 
  Edit, 
  Search, 
  FilterList,
  Person,
  Assignment,
  AssignmentTurnedIn,
  AssignmentLate
} from "@mui/icons-material";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";
import { deepPurple, green, blue, orange, red, grey } from "@mui/material/colors";

// Görev durumlarına göre renkler
const statusColors = {
  'bekliyor': blue[500],
  'devam ediyor': orange[500],
  'tamamlandı': green[500],
  'iptal': red[500]
};

// Görev durumuna göre ikon
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'tamamlandı':
      return <AssignmentTurnedIn fontSize="small" />;
    case 'devam ediyor':
      return <AccessTime fontSize="small" />;
    case 'iptal':
      return <AssignmentLate fontSize="small" />;
    default:
      return <Pending fontSize="small" />;
  }
};

// Avatar bileşeni
const TaskAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar
      sx={{
        bgcolor: deepPurple[500],
        width: 32,
        height: 32,
        fontSize: '0.875rem',
      }}
    >
      {initials}
    </Avatar>
  );
};

export default function Tasks() {
  const { role } = useAuthStore();
  const { tasks, addTask, updateTask, removeTask } = useTaskStore();

  // State'ler
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Kullanıcı listesi (gerçek uygulamada API'den çekilebilir)
  const users = ["Ayşe Demir", "Mehmet Kaya", "Zeynep Şahin", "Ahmet Yılmaz"];

  // Rol bazlı filtreleme
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    
    if (role === "yönetici") {
      return matchesSearch && matchesStatus && task.assignedTo !== "Sahip";
    } else if (role === "calisan") {
      return matchesSearch && matchesStatus && task.assignedTo === "Ayşe Demir";
    }
    return matchesSearch && matchesStatus;
  });

  // İlerleme durumunu hesapla
  const progress = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.status === 'tamamlandı').length / tasks.length) * 100) 
    : 0;

  // Yeni görev ekle
  const handleAdd = () => {
    if (title.trim() === "" || assignedTo.trim() === "") return;
    addTask({ 
      title, 
      assignedTo, 
      status: "bekliyor" as const,
      // Burada gerçek uygulamada daha fazla alan eklenebilir
    });
    setTitle("");
    setAssignedTo("");
  };

  // Görev durumunu güncelle
  const handleStatusChange = (taskId: number, currentStatus: string) => {
    let newStatus: 'bekliyor' | 'devam ediyor' | 'tamamlandı' | 'iptal';
    
    switch (currentStatus) {
      case 'bekliyor':
        newStatus = 'devam ediyor';
        break;
      case 'devam ediyor':
        newStatus = 'tamamlandı';
        break;
      case 'tamamlandı':
        newStatus = 'iptal';
        break;
      default:
        newStatus = 'bekliyor';
    }
    
    updateTask(taskId, newStatus);
  };

  return (
    <Box p={3}>
      {/* Başlık ve İstatistikler */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Görev Yönetimi
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Toplam {filteredTasks.length} görev listeleniyor
            {tasks.length > 0 && ` (${progress}% tamamlandı)`}
          </Typography>
          {tasks.length > 0 && (
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                mt: 1, 
                height: 8, 
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  bgcolor: progress === 100 ? 'success.main' : 'primary.main',
                  borderRadius: 5
                }
              }} 
            />
          )}
        </Box>
        
        {/* Yeni Görev Ekle Butonu */}
        {(role === "sahip" || role === "yönetici") && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => document.getElementById('add-task-dialog')?.scrollIntoView({ behavior: 'smooth' })}
            sx={{ 
              borderRadius: 5,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            Yeni Görev Ekle
          </Button>
        )}
      </Box>

      {/* Filtreleme ve Arama */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Görev veya atanan kişi ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Duruma Göre Filtrele</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as string)}
                  label="Duruma Göre Filtrele"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="">Tüm Durumlar</MenuItem>
                  <MenuItem value="bekliyor">Bekleyenler</MenuItem>
                  <MenuItem value="devam ediyor">Devam Edenler</MenuItem>
                  <MenuItem value="tamamlandı">Tamamlananlar</MenuItem>
                  <MenuItem value="iptal">İptal Edilenler</MenuItem>
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
                  setStatusFilter("");
                }}
                sx={{ borderRadius: 3, py: 1.5 }}
              >
                Sıfırla
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Görev Listesi */}
      <Grid container spacing={3}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  boxShadow: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: `4px solid ${statusColors[task.status as keyof typeof statusColors] || grey[500]}`,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                  {/* Görev Başlığı ve Durum */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Assignment 
                        color="action" 
                        fontSize="small" 
                        sx={{ mr: 1, color: 'text.secondary' }} 
                      />
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {task.title}
                      </Typography>
                    </Box>
                    <Chip 
                      icon={<StatusIcon status={task.status} />}
                      label={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      size="small"
                      sx={{ 
                        bgcolor: `${statusColors[task.status as keyof typeof statusColors] || grey[500]}15`,
                        color: statusColors[task.status as keyof typeof statusColors] || grey[700],
                        fontWeight: 'medium',
                        ml: 1
                      }}
                    />
                  </Box>

                  {/* Atanan Kişi ve Tarih */}
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {task.assignedTo}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* İşlem Butonları */}
                  <Box mt="auto" pt={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <TaskAvatar name={task.assignedTo} />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {new Date().toLocaleDateString('tr-TR')}
                      </Typography>
                    </Box>
                    
                    <Box>
                      {(role === "sahip" || role === "yönetici") && (
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
                                removeTask(task.id);
                              }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title="Durumu Değiştir">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleStatusChange(task.id, task.status)}
                          sx={{ 
                            ml: 1,
                            borderRadius: 3,
                            textTransform: 'none',
                            bgcolor: statusColors[task.status as keyof typeof statusColors] || 'primary.main',
                            '&:hover': {
                              bgcolor: statusColors[task.status as keyof typeof statusColors] || 'primary.dark',
                            }
                          }}
                        >
                          {task.status === 'tamamlandı' ? 'Tamamlandı' : 
                           task.status === 'devam ediyor' ? 'Tamamlandı Yap' : 
                           task.status === 'iptal' ? 'Yeniden Aç' : 'Başlat'}
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="h6" color="text.secondary">
                Görev bulunamadı
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Yeni bir görev eklemek için "Yeni Görev Ekle" butonunu kullanın.
              </Typography>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Yeni Görev Ekleme Formu */}
      {(role === "sahip" || role === "yönetici") && (
        <Box id="add-task-dialog" mt={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 4, p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Yeni Görev Ekle
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Görev Başlığı"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 3 }}
                  placeholder="Örnek: Proje raporunu tamamla"
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <FormControl fullWidth size="small">
                  <InputLabel id="assignee-label">Atanan Kişi</InputLabel>
                  <Select
                    labelId="assignee-label"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value as string)}
                    label="Atanan Kişi"
                    sx={{ borderRadius: 3 }}
                  >
                    {users.map((user) => (
                      <MenuItem key={user} value={user}>
                        {user}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAdd}
                  disabled={!title.trim() || !assignedTo.trim()}
                  sx={{ 
                    borderRadius: 3, 
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                  startIcon={<Add />}
                >
                  Ekle
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Box>
      )}
    </Box>
  );
}
