import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";
import NotificationButton from "./NotificationButton"; // Import your NotificationButton component
import colorConfigs from "../../configs/colorConfigs";
import axios from "axios";
type notifications ={
  id :String,
  name:string,
  message:string,
  avatar:"avatar2.png"

}
const Topbar = () => {
  const [user, setUser] = useState<{ userId?: string }>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios({
          method: 'GET',
          url: 'http://localhost:3000/check-authentication',
          withCredentials: true,
        });
        console.warn(response.data.user);
        setUser(response.data.user);
      } catch (err) {
        console.error("Authentication check failed:", err.message);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user.userId) return; // Wait until userId is available
      try {
        const response = await axios.get(`/notifications?userId=${user.userId}`);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error.message);
      }
    };
    fetchNotifications();
  }, [user.userId]);

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
            {user.name}
          </Typography>
          
          <NotificationButton notifications={notifications} />
          
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
