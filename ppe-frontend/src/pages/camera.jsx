import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Badge,
  LinearProgress,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import {
  green,
  red,
  orange,
  blue,
  grey,
} from "@mui/material/colors";
import io from "socket.io-client";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import ReactPlayer from "react-player";

const socket = io("http://localhost:5000"); // Replace with your backend URL

const CameraView = () => {
  const { id } = useParams();
  const [detection, setDetection] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [latestNotification, setLatestNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPPE, setSelectedPPE] = useState("All");

  useEffect(() => {
    socket.emit("join", `camera-${id}`);
    socket.on("detection", (data) => {
      setDetection(data);
      setLoading(false);

      if (data.length > 0) {
        const newAlert = `${data[data.length - 1]} (Camera ${id})`;
        setNotifications((prev) => [newAlert, ...prev]);
        setLatestNotification(newAlert);
        setOpenSnackbar(true);
      }
    });

    return () => socket.off("detection");
  }, [id]);

  const filteredDetections =
    selectedPPE === "All"
      ? detection
      : detection.filter((item) => item.toLowerCase().includes(selectedPPE.toLowerCase()));

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box
        sx={{
          bgcolor: blue[700],
          p: 3,
          color: "white",
          mb: 3,
          borderRadius: 2,
          textAlign: "center",
          position: "relative",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Camera {id} - Live View
        </Typography>

        {/* Notification Icon */}
        <Tooltip title="View Notifications">
          <IconButton
            sx={{ position: "absolute", top: 15, right: 20, color: "white" }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Camera Feed & Status */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            backgroundColor: "#000",
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            border: "4px solid #90CAF9",
            position: "relative",
          }}
        >
          {loading ? (
            <LinearProgress sx={{ width: "100%" }} />
          ) : (
            <ReactPlayer
              url={`http://localhost:5000/video_feed/${id}`} // Replace with your video feed URL
              playing
              controls
              width="100%"
              height="100%"
            />
          )}
          <Box
            sx={{
              position: "absolute",
              top: 15,
              left: 15,
              bgcolor: loading ? grey[500] : green[500],
              px: 2,
              py: 1,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {loading ? (
              <LiveTvIcon sx={{ color: "white" }} />
            ) : (
              <PlayCircleOutlineIcon sx={{ color: "white" }} />
            )}
            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              {loading ? "Connecting..." : "Live Stream"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* PPE Detection Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: green[100] }}>
            <Typography variant="h6">Total Detections</Typography>
            <Typography variant="h4" fontWeight="bold">
              {detection.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: orange[100] }}>
            <Typography variant="h6">Alerts</Typography>
            <Typography variant="h4" fontWeight="bold">
              {notifications.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: blue[100] }}>
            <Typography variant="h6">Compliance Rate</Typography>
            <Typography variant="h4" fontWeight="bold">
              {detection.length > 0 ? "85%" : "--"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* PPE Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Filter by PPE Type</Typography>
        <Select
          value={selectedPPE}
          onChange={(e) => setSelectedPPE(e.target.value)}
          sx={{ width: 200, borderRadius: 2, bgcolor: "white" }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Helmet">Helmet</MenuItem>
          <MenuItem value="Gloves">Gloves</MenuItem>
          <MenuItem value="Vest">Vest</MenuItem>
          <MenuItem value="Goggles">Safety Goggles</MenuItem>
        </Select>
      </Box>

      {/* PPE Detection Alerts */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        PPE Detection Alerts
      </Typography>

      {filteredDetections.length > 0 ? (
        <Grid container spacing={2}>
          {filteredDetections.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ bgcolor: item.includes("missing") ? red[50] : green[50], p: 2, border: `1px solid ${item.includes("missing") ? red[500] : green[500]}`, borderRadius: 1 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: item.includes("missing") ? red[500] : green[500] }}>
                    {item.includes("missing") ? <ErrorIcon /> : <CheckCircleIcon />}
                  </Avatar>
                  <Typography sx={{ fontWeight: 'bold' }}>{item}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="gray" variant="body1">
          All PPE in compliance! Keep up the great work!
        </Typography>
      )}

      {/* Motivational Call to Action */}
      <Box sx={{ mt: 4, p: 2, bgcolor: blue[100], borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          Remember: Safety First!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Ensure all personnel are wearing proper PPE to maintain safety on site.
        </Typography>
      </Box>

      {/* Snackbar Notification */}
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="warning">{latestNotification}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CameraView;
