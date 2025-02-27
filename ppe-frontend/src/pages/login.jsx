import { useState } from "react";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  IconButton, 
  InputAdornment, 
  Tabs, 
  Tab 
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Sign In
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    if (email && password) {
      if (isSignUp) {
        // Handle Sign Up logic
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        console.log("Signing up...");
        localStorage.setItem("user", email);
        navigate("/dashboard");
      } else {
        // Handle Sign In logic
        console.log("Signing in...");
        localStorage.setItem("user", email);
        navigate("/dashboard");
      }
    }
  };

  return (
    <Box 
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)", // Lighter gradient background
      }}
    >
      <Container maxWidth="xs">
        <Card 
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", 
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Lighter card background
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CardContent>
            {/* Tabs for Sign Up and Sign In */}
            <Tabs 
              value={isSignUp ? 1 : 0} 
              onChange={(e, newValue) => setIsSignUp(newValue === 1)} 
              centered
              sx={{ mb: 3 }}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            <Typography 
              variant="h4" 
              align="center" 
              gutterBottom 
              color="#333" // Darker text for better contrast
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Typography>

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#444" }} /> {/* Darker icon color */}
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2, 
                  backgroundColor: "rgba(0, 0, 0, 0.05)", // Lighter input background
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                },
              }}
              InputLabelProps={{ style: { color: "#555" } }} // Lighter label color
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#444" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                      sx={{ color: "#444" }} // Darker icon color
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2, 
                  backgroundColor: "rgba(0, 0, 0, 0.05)", // Lighter input background
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                },
              }}
              InputLabelProps={{ style: { color: "#555" } }} // Lighter label color
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm Password Field (Only for Sign Up) */}
            {isSignUp && (
              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#444" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        sx={{ color: "#444" }} // Darker icon color
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 2, 
                    backgroundColor: "rgba(0, 0, 0, 0.05)", // Lighter input background
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                  },
                }}
                InputLabelProps={{ style: { color: "#555" } }} // Lighter label color
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}

            {/* Submit Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
                background: "linear-gradient(135deg, #81d4fa, #29b6f6)", // Lighter gradient button
                color: "white",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.02)" },
              }}
              onClick={handleAuth}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            {/* Toggle Text */}
            <Typography variant="body2" align="center" sx={{ mt: 2, color: "#555" }}>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <Button 
                color="inherit" 
                onClick={() => setIsSignUp(!isSignUp)} 
                sx={{ textTransform: "none", p: 0, color: "#29b6f6" }} // Lighter button color
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Auth;
