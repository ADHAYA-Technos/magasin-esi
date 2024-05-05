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

//MAGASINIER
import  Profile  from "../pages/profile/Profile.tsx";
import StockManagement from "../magasinier/stockManagement.tsx"
import BRManagement from "../magasinier/brManagement.tsx"
import RapportInventaire from "../magasinier/rapportInventaire.tsx"
import BDRManagement  from "../magasinier/bdrManagement.tsx";
import BSManagement from "../magasinier/bsManagement.tsx";
import BDManagement from "../magasinier/bdManagement.tsx";
import React from "react";
export const magasinierRoutes: RouteType[] = [
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
      path: "/stock",
      element: <StockManagement />,
      state: "stock",
      sidebarProps: {
        displayText: "Stock Management",
        icon: <InventoryIcon />
      },
      child: [
        {
          path: "/stock/rapport",
          element: <RapportInventaire />,
          state: "stock.rapport",
          sidebarProps: {
            displayText: " Inventory Rapports"
          },
        }
      ]
    },
    {
      path: "/br",
      element: <BRManagement />,
      state: "br",
      sidebarProps: {
        displayText: "Bon de Laivraison",
        icon: <GradingIcon />
      }
    },
    {
      path: "/bs",
      element: <BSManagement />,
      state: "bs",
      sidebarProps: {
        displayText: "Bon de Sortie",
        icon: <FactCheckIcon />
      }
    }
    ,
    {
      path: "/bd",
      element: <BDManagement />,
      state: "bd",
      sidebarProps: {
        displayText: "Bon de Décharge",
        icon: <FactCheckIcon />
      }
    },
    
    {
      path: "/bdr",
      element: <BDRManagement />,
      state: "bdr",
      sidebarProps: {
        displayText: "Bon de Décharge de Ristitution",
        icon: <FactCheckIcon />
      }
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
  
  export default magasinierRoutes ;