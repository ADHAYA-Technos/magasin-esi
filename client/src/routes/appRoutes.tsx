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
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AlertPage from "../pages/component/AlertPage.tsx";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonIcon from '@mui/icons-material/Person';
import UserManagement from "../admin/UsersManagement.tsx"
import DocumentationPage from "../pages/documentation/DocumentationPage.tsx";
import React from "react";
import StructureManagement from "../admin/StructureManagement.tsx";
import RolesManagement from "../admin/RolesManagement.tsx";
import { Profile } from "../pages/profile/Profile.tsx";
import AccountsStatus from "../admin/AccountsStatus.tsx";


const adminRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },

  {
    path: "/dashboard", //MENU ITEM 
    element: <DashboardPageLayout />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <DashboardOutlinedIcon />
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,  //SUB Menu
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
      icon: <ManageAccountsIcon />
    },
    child: [
      {
        path: "/accounts/users",
        element: <UserManagement />,
        state: "accounts.users",
        sidebarProps: {
          displayText: "Users Management"
        },
      },
      {
        path: "/accounts/status",
        element: <AccountsStatus />,
        state: "accounts.status",
        sidebarProps: {
          displayText: "Account Status"
        },
      },
      {
        path: "/accounts/alert",
        element: <AlertPage />,
        state: "accounts.notifications",
        sidebarProps: {
          displayText: "Notifications"
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
      icon: <AccountTreeIcon />
    }
  },
  {
    path: "/roles",
    element: <RolesManagement />,
    state: "roles",
    sidebarProps: {
      displayText: "Roles Management",
      icon: <AccessibilityIcon />
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

export default adminRoutes ;