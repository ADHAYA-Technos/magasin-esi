import React, { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './NotificationButton.css'; // Import the CSS file for styling

const NotificationButton = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (id) => {
    
    switch (id) {
      case 1:
        window.location.href = '/page1';
        break;
      case 2:
        window.location.href = '/page2';
        break;
      // Add more cases for other notification IDs if needed
      default:
        // Handle default action or do nothing
        break;
    }
  };

  return (
    <div className="notification-button-wrapper">
      <IconButton
        className="notification-button"
        onClick={toggleNotifications}
        color="inherit"
        style={{ backgroundColor: 'transparent' }} // Set background color to transparent
      >
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {showNotifications && (
        <div className="notification-box">
          <h3>Notifications</h3>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="notification-item"
              onClick={() => handleNotificationClick(notification.id)} // Add click handler
            >
              <img
                src={process.env.PUBLIC_URL + `/img/${notification.avatar}`}
                alt="Avatar"
              />
              <div className="notification-text">
                <strong>{notification.name}</strong>
                <p>{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
