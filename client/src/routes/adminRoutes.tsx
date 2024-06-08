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



import RolesManagement from "../admin/RolesManagement.tsx";
import UserManagement from "../admin/UsersManagement.tsx";
import React from "react";


export const adminRoutes: RouteType[] = [
    {
    
      index: true,
      element: <HomePage />,
      state: "home"
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
      element: <RolesManagement />,
      state: "roles",
    
      sidebarProps: {
        icon: <GroupAddIcon />,
        displayText: "Roles Management",
        
      }},
    
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
  
  
  
  