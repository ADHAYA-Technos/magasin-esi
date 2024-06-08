import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, InputAdornment, Avatar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './ProfilePage.css';
import axios from 'axios';



const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<{ userId?: string }>({});

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
            <Avatar
            alt="Profile Picture"
            src="https://st2.depositphotos.com/3369547/12123/v/950/depositphotos_121230246-stock-illustration-man-male-avatar-suit-person.jpg"
            sx={{ width: 52, height: 52 }}
          />
              <h2>Edit Profile</h2>
            </div>
            <form noValidate autoComplete="off">
              <div className="grid">
                <TextField
                  fullWidth
                  label="Your Name"
                  defaultValue={user.name}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Service Name"
                  defaultValue={user.service}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={user.email}
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
                  defaultValue= {user.address}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Telephone"
                  defaultValue={user.telephone}
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
            <Avatar
            alt="Profile Picture"
            src="https://st2.depositphotos.com/3369547/12123/v/950/depositphotos_121230246-stock-illustration-man-male-avatar-suit-person.jpg"
            sx={{  width: 52, height: 52 }}
          />
              <h2>{user.name}</h2>
            </div>
            <div className="grid">
              <div className="profile-label">Your Name:</div>
              <div className="profile-value">{user.name}</div>
              <div className="profile-label">Service Name:</div>
              <div className="profile-value">{user.service}</div>
              <div className="profile-label">Email:</div>
              <div className="profile-value">{user.email}</div>
              <div className="profile-label">Address:</div>
              <div className="profile-value">{user.address}</div>
              <div className="profile-label">Telephone:</div>
              <div className="profile-value">{user.telephone}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
