import * as React from "react";
import { Container, Box, FormControl, InputLabel, Select, MenuItem, Button, Typography, TextField } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from 'axios';

export default function StatisticsDashboard() {
  const [services, setServices] = React.useState([]);
  const [selectedService, setSelectedService] = React.useState('');
  const [statisticType, setStatisticType] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [statistics, setStatistics] = React.useState([]);

  React.useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/getDistinctServices');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      let response;
      if (statisticType === 'MostConsumedProduct') {
        response = await axios.get('/api/getMostConsumedProductInPeriod', {
          params: { service: selectedService, startDate, endDate }
        });
      } else if (statisticType === 'ConsommateurWithMostBCIs') {
        response = await axios.get('/api/getConsommateurWithMostBCIs', {
          params: { service: selectedService }
        });
      }
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const renderChart = () => {
    if (statisticType === 'MostConsumedProduct') {
      return (
        <BarChart
          width={500}
          height={300}
          series={[{ data: statistics.map(stat => stat.totalQuantity), label: 'Total Quantity' }]}
          xAxis={[{ data: statistics.map(stat => stat.designation), scaleType: 'band' }]}
        />
      );
    } else if (statisticType === 'ConsommateurWithMostBCIs') {
      return (
        <BarChart
          width={500}
          height={300}
          series={[{ data: statistics.map(stat => stat.totalBCIs), label: 'Total BCIs' }]}
          xAxis={[{ data: statistics.map(stat => stat.name), scaleType: 'band' }]}
        />
      );
    }
    return null;
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Service</InputLabel>
          <Select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {services.map((service) => (
              <MenuItem key={service.service} value={service.service}>
                {service.service}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Statistic Type</InputLabel>
          <Select
            value={statisticType}
            onChange={(e) => setStatisticType(e.target.value)}
          >
            <MenuItem value="MostConsumedProduct">Most Consumed Product in Period</MenuItem>
            <MenuItem value="ConsommateurWithMostBCIs">Consommateur Who Created More BCIs</MenuItem>
          </Select>
        </FormControl>

        {statisticType === 'MostConsumedProduct' && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        )}

        <Button variant="contained" onClick={fetchStatistics}>
          Get Statistics
        </Button>

        <Box sx={{ mt: 4 }}>
          {renderChart()}
        </Box>
      </Box>
    </Container>
  );
}
