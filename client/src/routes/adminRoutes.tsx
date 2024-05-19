import DashboardPageLayout from "../pages/dashboard/DashboardPageLayout.tsx";
import HomePage from "../pages/home/HomePage.tsx";
import { RouteType } from "./config";
import DefaultPage from "../pages/dashboard/DefaultPage.tsx";
import DashboardIndex from "../pages/dashboard/DashboardIndex.tsx";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage.tsx";
import SaasPage from "../pages/dashboard/SaasPage.tsx";
import DocumentationPage from "../pages/documentation/DocumentationPage.tsx";
import  Profile  from "../pages/profile/Profile.tsx";
 //icons
 import GroupAddIcon from '@mui/icons-material/GroupAdd';
  import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';


//ASA


import CreateNewRole from "../admin/create-new-role/CreateNewRole.tsx";
import RolesManage from "../admin/roles-management/RolesManage.tsx";
import UserManagement from "../admin/UsersManagement.tsx";
import React from "react";


export const adminRoutes: RouteType[] = [
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
      path: "/users",
      element: <UserManagement />,
      state: "users",
      sidebarProps: {
        icon: <AdminPanelSettingsIcon />,
        displayText: "Users Management",
        
      },
      
    },
    {
      path: "/roles",
      element: <RolesManage />,
      state: "roles",
    
      sidebarProps: {
        icon: <GroupAddIcon />,
        displayText: "Roles Management",
        
      },
      child: [        {
        index: true,
        element: <RolesManage />,
        state: "roles.index"
      },
        {
          path: '/roles/createnewrole',
          element: <CreateNewRole />,
          state: "roles.createnewrole",
          sidebarProps: {
            displayText: "Create Role",
          
          }
        }]
    },
    {
      path: "/profile",
      element: <Profile />,
      state: "profile",
      sidebarProps: {
        displayText: "Profile Settings",
        icon: <PersonIcon />
      }
    }
  ];

  export default adminRoutes ;
  
  
  
  