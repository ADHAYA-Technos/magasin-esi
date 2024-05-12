import React from "react";
import BasicPie from "./Charts/BasicPie.tsx";
import BorderRadius from "./Charts/BorderRadius.tsx";
import LineChart from "./Charts/LineChart.tsx";

const HomePage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <h1 style={{ textAlign: "center" }}>HomePageDirecteur</h1>
        <LineChart />
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: "center" }}>Most requested products</h2>
          <BasicPie />
        </div>
        <div style={{ flex: 1 }}>
          <BorderRadius />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
