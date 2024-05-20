import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp.tsx";
import EmailConfirmation from "./pages/LoginSignUp/emailConfirmation.tsx";
import SignUpSuite from "./pages/LoginSignUp/SignUpSuite.tsx";
import { ASAROUTES, MAGASINIERROUTES, RSR, DIRECTOR, CONSOMATEUR, ADMINROUTES } from "./routes/index.tsx";
import axios from "axios";
import PageIllustration from "./pages/LoginSignUp/PageIllustration.jsx";
import { LinearProgress, Stack } from "@mui/material";
import ResetPassword from "./pages/LoginSignUp/ResetPassword.tsx";

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);
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
        setAuthenticated(response.data.state);
        setRoles(response.data.roles);
        setUserType(response.data.type);
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        // Handle authentication error
      }
    };
    checkAuthentication();
  }, []);

  // Handle loading state
  if (loading) {
    return <>  <div className="flex flex-col min-h-screen overflow-hidden antialiased bg-gray-900 text-gray-200 tracking-tight">
	<main className="grow">
		{/* Page illustration */}
		<div className="relative max-w-6xl mx-auto h-0 pointer-events-none" aria-hidden="true">
			<PageIllustration />
		</div>
   <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
<LinearProgress color="secondary" />
<LinearProgress color="success" />
<LinearProgress color="inherit" />
</Stack>
</main>
</div>
</> ;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify-email" element={<EmailConfirmation />} />
        <Route path="/SignUpSuite" element={<SignUpSuite />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {authenticated ? (
          <Route path="/" element={<MainLayout />}>
		
            {roles.includes('asa')?ASAROUTES:[]}
            {roles.includes('consommateur')?CONSOMATEUR:[]}
            {roles.includes('rsr')?RSR:[]}
            {roles.includes('director')?DIRECTOR:[]}
            {roles.includes('administrator')?ADMINROUTES:[]}
            {roles.includes('magasinier')?MAGASINIERROUTES:[]}
          </Route>
        ) : (
          <Route path="/" element={<LoginSignUp />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
