import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';

const annees = [
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
];

export default function SimpleLineChart() {
  const [montantTotal, setMontantTotal] = React.useState<number[]>([]);

  React.useEffect(() => {
    fetchMontant();
  }, []);

  const fetchMontant = async () => {
    try {
      const response = await axios.get('/api/getMontant');
      const fetchedData = response.data.reduce((acc, item) => {
        acc[item.year] = item.totalPu;
        return acc;
      }, {});
      
      const filledData = annees.map(year => fetchedData[year] || 0);
      setMontantTotal(filledData);
    } catch (error) {
      console.error('Error fetching montant total:', error);
    }
  };

  return (
    <LineChart
      width={1000}
      height={300}
      series={[
        { data: montantTotal, label: 'Montant total (DA)' },
      ]}
      xAxis={[{ scaleType: 'point', data: annees }]}
    />
  );
}
