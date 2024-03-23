import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout.tsx";
import HomePage from "../pages/home/HomePage.tsx";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage.tsx";
import DashboardIndex from "../pages/dashboard/DashboardIndex.tsx";
import ChangelogPage from "../pages/changelog/ChangelogPage.tsx";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage.tsx";
import SaasPage from "../pages/dashboard/SaasPage.tsx";
import AccountsManagementLayout from "../admin/AccountsManagementLayout.tsx";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AlertPage from "../pages/component/AlertPage.tsx";
 
import InstallationPage from "../pages/installation/InstallationPage.tsx";
import DocumentationPage from "../pages/documentation/DocumentationPage.tsx";
import React from "react";
import StructureManagement from "../admin/StructureManagement.tsx";
import RolesManagement from "../admin/RolesManagement.tsx";
import { Profile } from "../profile/Profile.tsx";
 

const appRoutes: RouteType[] = [
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
    path: "/accounts",
    element: <AccountsManagementLayout />,
    state: "accounts",
    sidebarProps: {
      displayText: "Accounts Management",
      icon: <AppsOutlinedIcon />
    },
    child: [
      {
        path: "/accounts/alert",
        element: <AlertPage />,
        state: "accounts.notifications",
        sidebarProps: {
          displayText: "Notifications"
        },
      },
      {
        path: "/accounts/status",
        element: <AlertPage />,
        state: "accounts.status",
        sidebarProps: {
          displayText: "Account Status"
        },
      }
     
    ]
  },
  {
    path: "/structure",
    element: <StructureManagement />,
    state: "structure",
    sidebarProps: {
      displayText: "Structures",
      icon: <ArticleOutlinedIcon />
    }
  },
  {
    path: "/roles",
    element: <RolesManagement />,
    state: "roles",
    sidebarProps: {
      displayText: "Roles Management",
      icon: <ArticleOutlinedIcon />
    }
  },
  {
    path: "/profile",
    element: <Profile />,
    state: "profile",
    sidebarProps: {
      displayText: "Profile Settings",
      icon: <ArticleOutlinedIcon />
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

export default appRoutes;