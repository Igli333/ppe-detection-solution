import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Stack,
  Chip,
} from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ClearIcon from '@mui/icons-material/Clear';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { green, red, orange, blue } from "@mui/material/colors";

// Sample Data
const complianceDataOptions = {
  weekly: [
    { date: "Mon", compliance: 80 },
    { date: "Tue", compliance: 85 },
    { date: "Wed", compliance: 90 },
    { date: "Thu", compliance: 88 },
    { date: "Fri", compliance: 92 },
  ],
  monthly: [
    { date: "Week 1", compliance: 78 },
    { date: "Week 2", compliance: 82 },
    { date: "Week 3", compliance: 85 },
    { date: "Week 4", compliance: 87 },
  ],
  yearly: [
    { date: "Jan", compliance: 75 },
    { date: "Feb", compliance: 80 },
    { date: "Mar", compliance: 85 },
    { date: "Apr", compliance: 90 },
    { date: "May", compliance: 92 },
  ],
};

const violationsDataOptions = {
  Helmet: { name: "Helmet", value: 25 },
  Gloves: { name: "Gloves", value: 15 },
  Vest: { name: "Vest", value: 30 },
  "Safety Goggles": { name: "Safety Goggles", value: 20 },
  Boots: { name: "Boots", value: 10 },
};

const COLORS = [red[500], orange[500], blue[500], green[500], "#FFBB28"];

const Statistics = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  const [selectedPPE, setSelectedPPE] = useState([]);

  const exportData = () => {
    console.log("Exporting Data with filters:", { timeRange, selectedPPE });
  };

  // Handle PPE selection change
  const handlePPESelectionChange = (event) => {
    const value = event.target.value;
    if (value.includes("clear")) {
      setSelectedPPE([]); // Clear selection if "Clear Selection" is chosen
    } else {
      setSelectedPPE(value); // Update selection
    }
  };

  // Filter violation data based on selected PPE types
  const filteredViolations = selectedPPE.map((type) => violationsDataOptions[type]);

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ bgcolor: blue[600], p: 3, color: "white", mb: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold">
          PPE Statistics & Compliance
        </Typography>
        <Typography variant="subtitle1">Detailed analytics on PPE usage and compliance trends</Typography>
      </Box>

      {/* Time Range & PPE Selection */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Time Range Selection */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <FormControl fullWidth>
              <InputLabel>Select Time Range</InputLabel>
              <Select 
              input={<OutlinedInput label="Select PPE Type" />}
              value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                <MenuItem value="weekly">Weekly</MenuItem>                
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>

        {/* Multi-Select PPE Filter */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <FormControl fullWidth>
              <InputLabel>Select PPE Type</InputLabel>
              <Select
                multiple
                value={selectedPPE}
                onChange={handlePPESelectionChange}
                input={<OutlinedInput label="Select PPE Type" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {/* Add a "Clear Selection" option */}
                <MenuItem value="clear" sx={{ fontStyle: "italic", color: "red" }}>
                  <ClearIcon fontSize="small" sx={{ mr: 1 }} />
                  Clear Selection
                </MenuItem>
                {Object.keys(violationsDataOptions).map((ppe) => (
                  <MenuItem key={ppe} value={ppe}>
                    {ppe}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      </Grid>

      {/* Compliance Trend Chart */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Compliance Rate Over Time ({timeRange || "Select a Range"})
        </Typography>
        {timeRange ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceDataOptions[timeRange]}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="compliance" fill={blue[500]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
            Please select a time range.
          </Typography>
        )}
      </Paper>

      {/* Violation Breakdown */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          PPE Violations ({selectedPPE.length > 0 ? selectedPPE.join(", ") : "Select PPE"})
        </Typography>
        {selectedPPE.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredViolations}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {filteredViolations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
            Please select PPE types to display violations.
          </Typography>
        )}
      </Paper>

      {/* Export Button */}
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" startIcon={<CloudDownloadIcon />} onClick={exportData}>
          Export Data
        </Button>
      </Box>
    </Container>
  );
};

export default Statistics;
