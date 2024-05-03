import { Avatar, Drawer, List, Stack, Toolbar,ListItem, ListItemText, Typography } from "@mui/material";

import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import asaRoutes from "../../routes/asaRoutes.tsx";
import magasinierRoutes from "../../routes/magasinierRoutes.tsx";
import SidebarItem from "./SidebarItem.tsx";
import SidebarItemCollapse from "./SidebarItemCollapse.tsx";
import React from "react";
import assets from "../../assets/";
import { RouteType } from "../../routes/config.ts";
import { grey } from "@mui/material/colors";

type Props = {}
const Sidebar = (props: RouteType[]) => {
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
        justifyContent: "space-between"
      }
    }}
  >
    <List disablePadding>
      <Toolbar sx={{ marginBottom: "20px" }}>
        <Stack
          sx={{ width: "100%" }}
          direction="row"
          justifyContent="center"
        >
          <Avatar src={assets.image.logo} />
        </Stack>
      </Toolbar>
      {/* Sidebar items */}
     
      {magasinierRoutes.map((route, index) => (
        route.sidebarProps ? (
          route.child ? (
            <SidebarItemCollapse item={route} key={index} />
          ) : (
            <SidebarItem item={route} key={index} />
          )
        ) : null
      ))}
    </List>
    
    {/* ESI-SMART-STORE text */}
  <Typography variant="body2" align="center" sx={{ marginBottom: "10px", color: grey }}>
    ©   ESI-SMART-STORE
    </Typography>
  </Drawer>
  );
};

export default Sidebar;