import { colors } from "@mui/material";

const colorConfigs = {
  sidebar: {
    bg: "#2c3e50", // Dark blue-gray background for the sidebar
    color: "#ffffff", // White text color for sidebar items
    hoverBg: "#34495e", // Slightly darker background color on hover
    activeBg: "#95a5a6" // Light gray color for active sidebar item
  },
  topbar: {
    bg: "#95a5a6", // Turquoise background for the topbar
    color: "#ffffff", // White text color for topbar items
    divider: "#bdc3c7" // Light gray color for divider
  },
  mainBg: colors.grey["200"] // Light gray background for the main content area
};

export default colorConfigs;
