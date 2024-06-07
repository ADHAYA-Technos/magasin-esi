import { Avatar, Drawer, List, Stack, Toolbar,ListItem, ListItemText, Typography, Button } from "@mui/material";

import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import asaRoutes from "../../routes/asaRoutes.tsx";
import magasinierRoutes from "../../routes/magasinierRoutes.tsx";
import rsrRoutes from "../../routes/rsrRoutes.tsx";
import consommateurRoutes from "../../routes/consommateurRoutes.tsx";
import directorRoutes from "../../routes/directorRoutes.tsx";
import adminRoutes from "../../routes/adminRoutes.tsx";
import SidebarItem from "./SidebarItem.tsx";
import SidebarItemCollapse from "./SidebarItemCollapse.tsx";
import React from "react";
import assets from "../../assets/";
import { RouteType } from "../../routes/config.ts";
import { grey } from "@mui/material/colors";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  roles: string[];
};


const Sidebar = ({ roles }: SidebarProps) => {
const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');
      if (response.status === 200) {
        console.log('Logout successful');
        navigate('/');
        window.location.reload();
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };
  console.warn(roles);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sizeConfigs.sidebar.width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sizeConfigs.sidebar.width,
          boxSizing: "border-box",
          borderRight: "0px",
          backgroundColor: colorConfigs.sidebar.bg,
          color: colorConfigs.sidebar.color,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <List disablePadding>
        <Toolbar sx={{ marginBottom: "20px" }}>
          <Stack sx={{ width: "100%" }} direction="row" justifyContent="center">
            <Avatar src={assets.image.logo} />
          </Stack>
        </Toolbar>

        {roles.includes("magasinier")
          ? magasinierRoutes.map((route, index) =>
              route.sidebarProps ? (
                route.child ? (
                  <SidebarItemCollapse item={route} key={index} />
                ) : (
                  <SidebarItem item={route} key={index} />
                )
              ) : null
            )
          :<></>}
         { roles.includes("asa") ?asaRoutes.map((route, index) =>
              route.sidebarProps ? (
                route.child ? (
                  <SidebarItemCollapse item={route} key={index} />
                ) : (
                  <SidebarItem item={route} key={index} />
                )
              ) : null
            ):<></>}
            { roles.includes("director")? directorRoutes.map((route, index) =>
            route.sidebarProps ? (
              route.child ? (
                <SidebarItemCollapse item={route} key={index} />
              ) : (
                <SidebarItem item={route} key={index} />
              )
            ) : null
          ):<></>}
          { roles.includes("consommateur") ?consommateurRoutes.map((route, index) =>
          route.sidebarProps ? (
            route.child ? (
              <SidebarItemCollapse item={route} key={index} />
            ) : (
              <SidebarItem item={route} key={index} />
            )
          ) : null
        ):<></>}
        { adminRoutes.map((route, index) =>
        route.sidebarProps ? (
          route.child ? (
            <SidebarItemCollapse item={route} key={index} />
          ) : (
            <SidebarItem item={route} key={index} />
          )
        ) : null
      )}
      <ListItem className="flex justify-end top-72 left-20">
          <Button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </Button>
        </ListItem>
      </List>

      <Typography variant="body2" align="center" sx={{ marginBottom: "10px", marginTop :"5px" ,color: grey }}>
        © ESI-SMART-STORE
      </Typography>
    </Drawer>
    
  );
};

export default Sidebar;