import { AppBar, Toolbar, Typography, Avatar, IconButton, Badge } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import React from "react";
import colorConfigs from "../../configs/colorConfigs";

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        borderRadius: "0 0 10px 10px",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Magasin ESI v0.1
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar alt="Profile Picture" src="https://st2.depositphotos.com/3369547/12123/v/950/depositphotos_121230246-stock-illustration-man-male-avatar-suit-person.jpg" sx={{ mr: 1, width: 32, height: 32 }} />
          <Typography variant="body1" sx={{ mr: 1, fontWeight: 500 }}>
            John Doe
          </Typography>
          <IconButton sx={{ mr: 1 }}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <div
            style={{
              width: 1,
              height: 24,
              backgroundColor: colorConfigs.topbar.divider,
              margin: "0 16px"
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Inventory Management
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
