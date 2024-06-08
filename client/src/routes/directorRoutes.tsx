import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout.tsx";
import HomePage from "../pages/home/HomePage.tsx";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage.tsx";
import DashboardIndex from "../pages/dashboard/DashboardIndex.tsx";
import SaasPage from "../pages/dashboard/SaasPage.tsx";
import DocumentationPage from "../pages/documentation/DocumentationPage.tsx";
import Profile from "../pages/profile/Profile.tsx";
//icons
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PersonIcon from "@mui/icons-material/Person";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";

//Director
import CombinedComponent from "../Director/Statistics/statistics.tsx";

import BciManagement from "../Director/bciValidation.tsx";
import React from "react";
import StatisticsDashboard from "../Director/Statistics/ServiceStatistics.tsx";

export const directorRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home",
  },

  {
    
    path: "/dashboard",
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Statistics",
      icon: <InsertChartIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "dashboard.index",
      },
     
      {
        path: "/dashboard/analytics",
        element: <StatisticsDashboard />,
        state: "dashboard.analytics",
        sidebarProps: {
          displayText: "Statistics of Services",
        },
      },
      {
        path: "/dashboard/saas",
        element: <CombinedComponent />,
        state: "dashboard.saas",
        sidebarProps: {
          displayText: "Statistics of Consummers",
        },
      },
    ],
  },
  {
    path: "/dbcivalidation",
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
  },
  {
    path: "/documentation",
    element: <DocumentationPage />,
    state: "documentation",
    sidebarProps: {
      displayText: "Documentation",
      icon: <ArticleOutlinedIcon />,
    },
  },
];

export default directorRoutes;
