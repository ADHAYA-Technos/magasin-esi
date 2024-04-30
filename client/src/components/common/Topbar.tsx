import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";
import NotificationButton from "./NotificationButton"; // Import your NotificationButton component
import colorConfigs from "../../configs/colorConfigs";

const Topbar = () => {
  const notifications = [
    {
      id: 1,
      name: "dayt yasin",
      message: "@lorem ipsum dolor sit amet df,",
      avatar: "avatar1.png",
    },
    {
      id: 2,
      name: "John Doe",
      message: "@lorem ipsum dolor sit amet",
      avatar: "avatar2.png",
    },
    {
      id: 3,
      name: "Djaber",
      message: "@lorem ipsum dolor sit amet",
      avatar: "avatar3.png",
    },
    // Add more notifications as needed
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        borderRadius: "0 0 10px 10px",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Magasin ESI v0.1
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt="Profile Picture"
            src="https://st2.depositphotos.com/3369547/12123/v/950/depositphotos_121230246-stock-illustration-man-male-avatar-suit-person.jpg"
            sx={{ mr: 1, width: 32, height: 32 }}
          />
          <Typography variant="body1" sx={{ mr: 1, fontWeight: 500 }}>
            John Doe
          </Typography>
          {/* Use the NotificationButton component */}
          <NotificationButton notifications={notifications} />
          {/* End NotificationButton */}
          <div
            style={{
              width: 1,
              height: 24,
              backgroundColor: colorConfigs.topbar.divider,
              margin: "0 16px",
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
