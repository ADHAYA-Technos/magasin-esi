import React, { useState } from 'react';
import { IconButton, Badge , Avatar } from '@mui/material';
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
        window.location.href = '/page';
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
               <Avatar
            alt="Profile Picture"
            src="https://st2.depositphotos.com/3369547/12123/v/950/depositphotos_121230246-stock-illustration-man-male-avatar-suit-person.jpg"
            sx={{ mr: 1, width: 32, height: 32 }}
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
