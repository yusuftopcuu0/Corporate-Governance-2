import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  People,
  Business,
  Assignment,
  Email,
  TrendingUp,
  Notifications,
  CheckCircle,
  Warning,
} from "@mui/icons-material";

const Dashboard = () => {
  const stats = [
    {
      title: "Toplam Çalışan",
      value: 24,
      icon: <People fontSize="large" color="primary" />,
      progress: 75,
      trend: 12,
    },
    {
      title: "Departmanlar",
      value: 4,
      icon: <Business fontSize="large" color="secondary" />,
      progress: 100,
      trend: 5,
    },
    {
      title: "Aktif Projeler",
      value: 6,
      icon: <Assignment fontSize="large" color="success" />,
      progress: 60,
      trend: 8,
    },
    {
      title: "Günlük Mesajlar",
      value: 128,
      icon: <Email fontSize="large" color="warning" />,
      progress: 80,
      trend: -3,
    },
  ].map((stat, index) => ({ ...stat, id: index }));

  const departmentData = [
    { name: "IT", value: 10, color: "#1976d2" },
    { name: "İK", value: 5, color: "#9c27b0" },
    { name: "Finans", value: 4, color: "#ff9800" },
    { name: "Pazarlama", value: 5, color: "#4caf50" },
  ];

  const messagesData = [
    { month: "Oca", messages: 200, target: 300 },
    { month: "Şub", messages: 300, target: 350 },
    { month: "Mar", messages: 250, target: 400 },
    { month: "Nis", messages: 400, target: 400 },
    { month: "May", messages: 350, target: 450 },
    { month: "Haz", messages: 500, target: 500 },
  ];

  const projectStatusData = [
    { name: "Tamamlanan", value: 45, color: "#4caf50" },
    { name: "Devam Eden", value: 30, color: "#2196f3" },
    { name: "Beklemede", value: 15, color: "#ff9800" },
    { name: "Riskli", value: 10, color: "#f44336" },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Yusuf Topçu",
      action: "proje durumunu güncelledi",
      time: "4 dk önce",
      icon: <CheckCircle color="success" />,
    },
    {
      id: 2,
      user: "Ahmet Yılmaz",
      action: "yeni bir görev oluşturdu",
      time: "25 dk önce",
      icon: <Assignment color="primary" />,
    },
    {
      id: 3,
      user: "Ayşe Demir",
      action: "proje durumunu güncelledi",
      time: "1 saat önce",
      icon: <CheckCircle color="success" />,
    },
    {
      id: 4,
      user: "Mehmet  Kaya",
      action: "önemli bir duyuru yayınladı",
      time: "3 saat önce",
      icon: <Notifications color="warning" />,
    },
    {
      id: 5,
      user: "Zeynep Şahin",
      action: "yeni bir dosya yükledi",
      time: "5 saat önce",
      icon: <Warning color="error" />,
    },
  ];

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
            Yönetim Paneli
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date().toLocaleDateString("tr-TR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <TrendingUp color="success" sx={{ mr: 1 }} />
          <Typography variant="body1" color="success.main">
            Genel Performans: +8.2%
          </Typography>
        </Box>
      </Box>

      {/* Üstte istatistik kartları */}
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "primary.light",
                      p: 1.5,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  <Box width="100%" mr={1}>
                    <LinearProgress
                      variant="determinate"
                      value={stat.progress}
                      sx={{ height: 8, borderRadius: 5 }}
                      color={
                        stat.progress > 80
                          ? "success"
                          : stat.progress > 50
                          ? "primary"
                          : "warning"
                      }
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.progress}%
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUp
                    color={stat.trend >= 0 ? "success" : "error"}
                    fontSize="small"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography
                    variant="body2"
                    color={stat.trend >= 0 ? "success.main" : "error.main"}
                  >
                    {stat.trend >= 0 ? "+" : ""}
                    {stat.trend}% geçen aya göre
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Grafikler ve İçerik */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 4,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Departman Dağılımı
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => {
                        const total = departmentData.reduce(
                          (sum, item) => sum + item.value,
                          0
                        );
                        const percentage = ((value / total) * 100).toFixed(0);
                        return `${name}: ${percentage}%`;
                      }}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} kişi`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box mt={2}>
                {departmentData.map((dept, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center">
                      <Box
                        width={12}
                        height={12}
                        bgcolor={dept.color}
                        mr={1}
                        borderRadius="50%"
                      />
                      <Typography variant="body2">{dept.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {dept.value} kişi
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 4,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Aylık Mesaj İstatistikleri
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={messagesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorMessages"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#1976d2"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1976d2"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorTarget"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4caf50"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4caf50"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        name === "messages" ? "Gerçekleşen" : "Hedef",
                      ]}
                      labelFormatter={(label) => `Ay: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="messages"
                      stroke="#1976d2"
                      fillOpacity={1}
                      fill="url(#colorMessages)"
                      name="Gerçekleşen"
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="#4caf50"
                      fillOpacity={0.1}
                      fill="url(#colorTarget)"
                      name="Hedef"
                      strokeDasharray="5 5"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 4,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flex: 1, p: 0, "&:last-child": { pb: 0 } }}>
              <Box p={3} borderBottom={1} borderColor="divider">
                <Typography variant="h6" fontWeight="bold">
                  Son Aktiviteler
                </Typography>
              </Box>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  overflow: "auto",
                  maxHeight: 400,
                }}
              >
                {recentActivities.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "action.hover" }}>
                          {activity.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <Typography
                              component="span"
                              variant="subtitle2"
                              color="text.primary"
                            >
                              {activity.user}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {" "}
                              {activity.action}
                            </Typography>
                          </>
                        }
                        secondary={
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {activity.time}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 4,
              p: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Proje Durumları
            </Typography>
            <Grid container spacing={3}>
              {projectStatusData.map((status) => (
                <Grid item xs={12} sm={6} md={3} key={status.name}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderLeft: `4px solid ${status.color}`,
                      bgcolor: "background.default",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      {status.name}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h5" fontWeight="bold">
                        {status.value}%
                      </Typography>
                      <Box width="60%">
                        <LinearProgress
                          variant="determinate"
                          value={status.value}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            bgcolor: "action.hover",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: status.color,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
