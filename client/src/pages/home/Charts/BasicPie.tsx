import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { ClassNames } from "@emotion/react";

// le produit plus commondes
const prodQun = { product: 'Ordinateur de bureau', quntiter: 30 };
const products = [ 'Ordinateur de bureau', 'Ordinateur portable','Clavier','mouse','cable rg45'];
const quntiter = [
  '100',
  '200',
  '300',
  '400',
  '20',
  
];


export default function BasicPie() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: "Ordinateur de bureau" },
            { id: 1, value: 15, label: "Ordinateur portable" },
            { id: 2, value: 20, label: "Clavier" },
            { id: 3, value: 40, label: 'cable rg45' },
            { id: 4, value: 50, label: 'mouse'}
          ],
        },
      ]}
      width={500}
      height={200}
    />
  );
}



