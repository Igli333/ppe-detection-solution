import { useState } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Tooltip, 
  Grid, 
  Paper, 
  Avatar, 
  LinearProgress, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Select, 
  MenuItem 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { green, red, orange, blue, teal } from "@mui/material/colors";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cameras] = useState([
    { id: 1, name: "Camera 1", status: "Online", thumbnail: "https://via.placeholder.com/150" },
    { id: 2, name: "Camera 2", status: "Offline", thumbnail: "https://via.placeholder.com/150" },
    { id: 3, name: "Camera 3", status: "Online", thumbnail: "https://via.placeholder.com/150" },
  ]);
  const [notifications] = useState([
    { id: 1, message: "Helmet missing at Zone F", timestamp: "10:30 AM", type: "error", ppe: "Helmet" },
    { id: 2, message: "Gloves not detected in Zone U", timestamp: "10:25 AM", type: "warning", ppe: "Gloves" },
    { id: 3, message: "Hairnet missing at Zone C", timestamp: "10:20 AM", type: "error", ppe: "Hairnet" },
    { id: 4, message: "Earplug not detected in Zone K", timestamp: "10:15 AM", type: "warning", ppe: "Earplug" },
    { id: 5, message: "Vest missing at Zone D", timestamp: "10:10 AM", type: "error", ppe: "Vest" },
    { id: 6, message: "Safety goggles missing at Zone X", timestamp: "10:05 AM", type: "error", ppe: "Safety Goggles" },
    { id: 7, message: "Boots not detected in Zone Y", timestamp: "10:00 AM", type: "warning", ppe: "Boots" },
  ]);
  const [selectedPPE, setSelectedPPE] = useState("All");
  const [showMore, setShowMore] = useState(false);
  const totalDetections = 120;
  const complianceRate = 85;
  const complianceData = [
    { time: "9:00 AM", rate: 80 },
    { time: "10:00 AM", rate: 85 },
    { time: "11:00 AM", rate: 90 },
    { time: "12:00 PM", rate: 88 },
  ];

  const fetchNotifications = () => {
    console.log("Fetching notifications...");
  };

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  const filteredNotifications = selectedPPE === "All"
    ? notifications
    : notifications.filter(notification => notification.ppe === selectedPPE);

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ bgcolor: teal[300], p: 3, color: 'white', mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold">PPE Detection System</Typography>
        <Typography variant="subtitle1">Real-time monitoring and alerts</Typography>
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate("/statistics")}
        sx={{ mb:4, mt: 2, borderRadius: 2 }}
        >
        View Statistics
        </Button>

      {/* Search Bar */}
      {/* <TextField
        fullWidth
        placeholder="Search notifications or cameras..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4, borderRadius: 2 }}
      /> */}

      {/* Compliance Dashboard */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 2, bgcolor: green[50] }}>
            <Typography variant="h6" gutterBottom>Total Detections</Typography>
            <Typography variant="h4" fontWeight="bold">{totalDetections}</Typography>
            <LinearProgress 
              variant="determinate" 
              value={100} 
              sx={{ mt: 2, height: 8, borderRadius: 5 }} 
              color="success"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={4} sx={{ p: 2, borderRadius: 2, bgcolor: orange[50] }}>
            <Typography variant="h6" gutterBottom>Compliance Rate</Typography>
            <Typography variant="h4" fontWeight="bold">{complianceRate}%</Typography>
            <LinearProgress 
              variant="determinate" 
              value={complianceRate} 
              sx={{ mt: 2, height: 8, borderRadius: 5 }} 
              color="success"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Compliance Trend Chart */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Compliance Trend</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={complianceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <ChartTooltip />
            <Line type="monotone" dataKey="rate" stroke={teal[600]} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* PPE Selection Dropdown */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Select PPE Type</Typography>
        <Select
          value={selectedPPE}
          onChange={(e) => setSelectedPPE(e.target.value)}
          sx={{ width: 200, borderRadius: 2, bgcolor: 'white' }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Earplug">Earplug</MenuItem>
          <MenuItem value="Hairnet">Hairnet</MenuItem>
          <MenuItem value="Helmet">Helmet</MenuItem>
          <MenuItem value="Safety Goggles">Safety Goggles</MenuItem>
          <MenuItem value="Vest">Vest</MenuItem>
        </Select>
      </Box>

      {/* Notifications Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" color="error">PPE Alerts</Typography>
          <Tooltip title="Help">
            <IconButton>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {filteredNotifications.slice(0, showMore ? filteredNotifications.length : 5).map((alert) => (
          <Card 
            key={alert.id} 
            sx={{ 
              my: 1, 
              backgroundColor: alert.type === "error" ? orange[100] : teal[100], 
              transition: 'transform 0.2s',
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': { transform: 'scale(1.03)' }
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alert.type === "error" ? orange[500] : teal[600] }}>
                {alert.type === "error" ? <WarningIcon /> : <InfoIcon />}
              </Avatar>
              <Box>
                <Typography>{alert.message}</Typography>
                <Typography variant="body2" color="textSecondary">{alert.timestamp}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}

        {filteredNotifications.length > 5 && (
          <Button 
            variant="outlined" 
            onClick={toggleShowMore} 
            sx={{ mt: 2, borderRadius: 2 }}
          >
            {showMore ? "Show Less" : "View More"}
          </Button>
        )}
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={fetchNotifications}
          sx={{ mt: 2, ml: 1, borderRadius: 2 }}
        >
          Refresh Notifications
        </Button>
      </Paper>

      {/* Camera Selection */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Select a Camera</Typography>
        <Grid container spacing={2}>
          {cameras.map((cam) => (
            <Grid item key={cam.id} xs={12} sm={6} md={4}>
              <Tooltip title={`Go to ${cam.name}`}>
                <Card 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    cursor: "pointer", 
                    backgroundColor: teal[50],
                    transition: '0.3s',
                    '&:hover': { boxShadow: 6 } 
                  }}
                  onClick={() => navigate(`/camera/${cam.id}`)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={cam.thumbnail} />
                    <Box>
                      <Typography fontWeight="bold">{cam.name}</Typography>
                      <Typography variant="body2" color={cam.status === "Online" ? green[500] : red[500]}>
                        {cam.status}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Paper>



      {/* Footer */}
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f0f0f0', textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="body2">© 2025 PPE Detection. All rights reserved.</Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
