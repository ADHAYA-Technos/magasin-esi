import { colors } from "@mui/material";

const colorConfigs = {
  sidebar: {
    bg: "#051D40", // Dark blue-gray background for the sidebar
    color: "#ffffff", // White text color for sidebar items
    hoverBg: "#09326f", // Slightly darker background color on hover
    activeBg: "#09326f" // Light gray color for active sidebar item
  },
  topbar: {
    bg: "#0b3d87", // Turquoise background for the topbar
    color: "#ffffff", // White text color for topbar items
    divider: "#bdc3c7" // Light gray color for divider
  },
  mainBg: colors.grey["200"] // Light gray background for the main content area
};

export default colorConfigs;
