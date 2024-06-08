import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import axios from 'axios';

export default function BasicPie() {
  const [productData, setProductData] = React.useState([]);

  React.useEffect(() => {
    fetchTopRequestedProducts();
  }, []);

  const fetchTopRequestedProducts = async () => {
    try {
      const response = await axios.get('/api/getTopRequestedProducts');
      const fetchedData = response.data.map((item, index) => ({
        id: index,
        value: item.totalQuantity,
        label: item.designation,
      }));
      setProductData(fetchedData);
    } catch (error) {
      console.error('Error fetching top requested products:', error);
    }
  };

  return (
   
    <PieChart
   
      series={[{ data: productData }]}
      width={500}
      height={200}
    />
  );
}
