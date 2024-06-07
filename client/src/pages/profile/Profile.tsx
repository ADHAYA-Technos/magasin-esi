import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './ProfilePage.css';

const fetchProfileData = async () => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        role: 'Consumer',
      });
    }, 1000);
  });
};

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleShowClick = () => {
    setIsEditing(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="nav">
          <span
            onClick={handleShowClick}
            className={!isEditing ? 'active' : ''}
          >
            Show Profile
          </span>
          <span
            onClick={handleEditClick}
            className={isEditing ? 'active' : ''}
          >
            Edit Profile
          </span>
        </div>

        {isEditing ? (
          <div>
            <div className="header">
              <img
                src="/img/avatar1.png"
                alt="Profile"
              />
              <h2>Edit Profile</h2>
            </div>
            <form noValidate autoComplete="off">
              <div className="grid">
                <TextField
                  fullWidth
                  label="Your Name"
                  defaultValue="Charlene Reed"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Service Name"
                  defaultValue="Charlene Reed"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue="charlenereed@gmail.com"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="********"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Address"
                  defaultValue="San Jose, California, USA"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Telephone"
                  defaultValue="+312"
                  variant="outlined"
                />
              </div>
              <div className="button-container">
                <Button variant="contained">
                  Save
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="header">
              <img
                src="/img/avatar1.png"
                alt="Profile"
              />
              <h2>Charlene Reed</h2>
            </div>
            <div className="grid">
              <div className="profile-label">Your Name:</div>
              <div className="profile-value">Charlene Reed</div>
              <div className="profile-label">Service Name:</div>
              <div className="profile-value">Charlene Reed</div>
              <div className="profile-label">Email:</div>
              <div className="profile-value">charlenereed@gmail.com</div>
              <div className="profile-label">Address:</div>
              <div className="profile-value">San Jose, California, USA</div>
              <div className="profile-label">Telephone:</div>
              <div className="profile-value">+312</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
