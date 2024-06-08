import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout.tsx";
import HomePage from "../pages/home/HomePage.tsx";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage.tsx";
import DashboardIndex from "../pages/dashboard/DashboardIndex.tsx";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage.tsx";
import SaasPage from "../pages/dashboard/SaasPage.tsx";
import DocumentationPage from "../pages/documentation/DocumentationPage.tsx";
import Profile from "../pages/profile/Profile.tsx";
//icons

import PersonIcon from "@mui/icons-material/Person";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";

//CONSOMATEUR

import BciManagement from "../RSR/bciValidation.tsx";
import React from "react";

export const rsrRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },

  
  {
    path: "/rbcivalidation",
    element: <BciManagement />,
    state: "bci",
    sidebarProps: {
      displayText: "BCI Validation",
      icon: <ReceiptIcon />,
    },
  },
  {
    path: "/profile",
    element: <Profile />,
    state: "profile",
    sidebarProps: {
      displayText: "Profile Settings",
      icon: <PersonIcon />,
    },
  }
  
];

export default rsrRoutes;
