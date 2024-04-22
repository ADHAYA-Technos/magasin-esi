import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout.tsx";
import HomePage from "../pages/home/HomePage.tsx";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage.tsx";
import DashboardIndex from "../pages/dashboard/DashboardIndex.tsx";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage.tsx";
import SaasPage from "../pages/dashboard/SaasPage.tsx";
import DocumentationPage from "../pages/documentation/DocumentationPage.tsx";
import { Profile } from "../pages/profile/Profile.tsx";
 //icons
 import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonIcon from '@mui/icons-material/Person';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptIcon from '@mui/icons-material/Receipt';


//ASA

import ChapitresManagements from "../service_achats/chapitresManagement.tsx";
import ProductManagement from "../service_achats/productsManagements.tsx";
import ArticleManagement from "../service_achats/articleManagement.tsx";
import BceManagement from "../service_achats/bceManagement.tsx";
import React from "react";

export const serviceAchatsRoutes: RouteType[] = [
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
      path: "/chapitres",
      element: <ChapitresManagements />,
      state: "chapitres",
      sidebarProps: {
        displayText: "Chapitres Management",
        icon: < DescriptionIcon/>
      }
      
    },
    {
      path: "/articles",
      element: <ArticleManagement />,
      state: "articles",
      sidebarProps: {
        displayText: "Article Management",
        icon: <AccountTreeIcon />
      }
    },
    {
      path: "/products",
      element: <ProductManagement/>,
      state: "roles",
      sidebarProps: {
        displayText: "Products Management",
        icon: <Inventory2Icon />
      }
    },
    {
      path: "/bce",
      element: <BceManagement/>,
      state: "bce",
      sidebarProps: {
        displayText: "BCE Management",
        icon: <ReceiptIcon />
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
    }
  ];

  export default serviceAchatsRoutes ;
  
  
  
  