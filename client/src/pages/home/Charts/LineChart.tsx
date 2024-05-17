import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

// const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const montantTotal = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
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
  return (
    <LineChart
      
      width={1000}
      height={300}
      series={[
        { data: montantTotal, label: ' Montant total (DA) ' },        
      ]}
      xAxis={[{ scaleType: 'point', data: annees }]}
      
    />
  );
}