
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const quantiteProduite = [10, 110, 12, 30, 40 ];
const services = [
  'service 01',
  'service 02',
  'service 03',
  'service 04',
  'service 05',
  
];

export default function SimpleBarChart() {
  return (
    <BarChart
      width={500}
      height={300}
      series={[
        
        { data: quantiteProduite, label: 'les service que demande beaucoup produite', id: 'uvId' },
      ]}
      xAxis={[{ data: services, scaleType: 'band' }]}
    />
  );
}