import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useAuthStore } from "../store/useAuthStore";

export default function Dashboard() {
  const { role } = useAuthStore();

  const renderContent = () => {
    switch (role) {
      case "owner":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6">Toplam Çalışan</Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    52
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6">Yöneticiler</Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    5
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6">Aktif Görevler</Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    120
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case "manager":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6">Ekibimdeki Çalışanlar</Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    12
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6">Atanmış Görevler</Typography>
                  <Typography variant="h4" sx={{ mt: 1 }}>
                    24
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case "employee":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                <CardContent>
                  <Typography variant="h6">Benim Görevlerim</Typography>
                  <ul>
                    <li>Rapor hazırlama</li>
                    <li>Toplantıya katılma</li>
                    <li>Proje güncellemesi</li>
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return <Typography>Rol bulunamadı.</Typography>;
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {renderContent()}
    </div>
  );
}
