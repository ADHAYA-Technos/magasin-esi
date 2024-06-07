import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

export default function SimpleBarChart() {
  const [quantiteProduite, setQuantiteProduite] = React.useState<number[]>([]);
  const [services, setServices] = React.useState<string[]>([]);

  React.useEffect(() => {
    fetchTopServices();
  }, []);

  const fetchTopServices = async () => {
    try {
      const response = await axios.get('/api/getTopServices');
      const fetchedData = response.data;
      const serviceNames = fetchedData.map(item => item.service);
      const quantities = fetchedData.map(item => item.totalLigneBci);
      setServices(serviceNames);
      setQuantiteProduite(quantities);
    } catch (error) {
      console.error('Error fetching top services:', error);
    }
  };

  return (
    <BarChart
      width={500}
      height={300}
      series={[
        { data: quantiteProduite, label: 'Les services qui demandent beaucoup de produits', id: 'uvId' },
      ]}
      xAxis={[{ data: services, scaleType: 'band' }]}
    />
  );
}
