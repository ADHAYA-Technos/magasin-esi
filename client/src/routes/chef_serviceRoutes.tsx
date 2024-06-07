import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout.tsx";
import HomePage from "../pages/home/HomePage.tsx";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage.tsx";
import DashboardIndex from "../pages/dashboard/DashboardIndex.tsx";
import ChangelogPage from "../pages/changelog/ChangelogPage.tsx";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage.tsx";
import SaasPage from "../pages/dashboard/SaasPage.tsx";
import DocumentationPage from "../pages/documentation/DocumentationPage.tsx";
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';

 //icons
 import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonIcon from '@mui/icons-material/Person';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import FactCheckIcon from '@mui/icons-material/FactCheck';


import GradingIcon from '@mui/icons-material/Grading';

//
import  Profile  from "../pages/profile/Profile.tsx";
import ValiderBci  from "../chef_service/ValiderBci.tsx";
import React, { useState, useEffect } from 'react';
export const chef_serviceRoutes: RouteType[] = [
    {
      index: true,
      element: <HomePage />,
      state: "home"
    },
  
    {
      path: "/dashboard",
      element: <DashboardPageLayout />,
      state: "dashboard",
      sidebarProps: {
        displayText: "Dashboard",
        icon: <DashboardOutlinedIcon />
      },
      child: [
        {
          index: true,
          element: <DashboardIndex />,
          state: "dashboard.index"
        },
        {
          path: "/dashboard/default",
          element: <DefaultPage />,
          state: "dashboard.default",
          sidebarProps: {
            displayText: "Default"
          },
        },
        {
          path: "/dashboard/analytics",
          element: <AnalyticsPage />,
          state: "dashboard.analytics",
          sidebarProps: {
            displayText: "Analytic"
          }
        },
        {
          path: "/dashboard/saas",
          element: <SaasPage />,
          state: "dashboard.saas",
          sidebarProps: {
            displayText: "Saas"
          }
        }
      ]
    },
  
    {
        path: "/validBci",
        element: <ValiderBci />,
        state: "validBci",
        sidebarProps: {
          displayText: "Valid Le Bon De Commande Interne",
          icon: <FactCheckIcon />,
        },
      },
    
    {
      path: "/profile",
      element: <Profile />,
      state: "profile",
      sidebarProps: {
        displayText: "Profile Settings",
        icon: <PersonIcon />
      }
    },
    {
      path: "/documentation",
      element: <DocumentationPage />,
      state: "documentation",
      sidebarProps: {
        displayText: "Documentation",
        icon: <ArticleOutlinedIcon />
      }
    },
    {
      path: "/changelog",
      element: <ChangelogPage />,
      state: "changelog",
      sidebarProps: {
        displayText: "Changelog",
        icon: <FormatListBulletedOutlinedIcon />
      }
    }
  ];
  
  export default chef_serviceRoutes ;