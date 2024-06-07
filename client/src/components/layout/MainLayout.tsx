import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import colorConfigs from "../../configs/colorConfigs";
import sizeConfigs from "../../configs/sizeConfigs";
import Sidebar from "../common/Sidebar.tsx";
import Topbar from "../common/Topbar.tsx";
import React, { useEffect, useState } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import axios from "axios";
type Props = {};

const MainLayout = (props: Props) => {
  const [status, setStatus] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [userType, setUserType] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios({
          method: 'GET',
          url: 'http://localhost:3000/check-authentication',
          withCredentials: true,
        });
        setStatus(response.data.state);
        setRoles(response.data.roles);
        setUserType(response.data.type);
        setUser(response.data.user);
      } catch (err) {
        setStatus(false);
        //alert(err.response.data.message);
      }
    };
    checkAuthentication();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />
      <Box
        component="nav"
        sx={{
          width: sizeConfigs.sidebar.width,
          flexShrink: 0,
        }}
      >
        <Sidebar roles={roles} />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${sizeConfigs.sidebar.width})`,
          minHeight: "100vh",
          backgroundColor: colorConfigs.mainBg,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;