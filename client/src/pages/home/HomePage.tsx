import axios from "axios";
import BasicPie from "./Charts/BasicPie.tsx";
import BorderRadius from "./Charts/BorderRadius.tsx";
import LineChart from "./Charts/LineChart.tsx";
import BCIValidation from "../../RSR/bciValidation.tsx";
import BCIsetShowAddBCIManagement from "../../Consommateur/bciManagement.tsx";
import BceManagement from "../../service_achats/bceManagement.tsx";
import UsersManagement from "../../admin/UsersManagement.tsx";
import BrManagement from "../../service_achats/bceManagement.tsx";
import React, { useEffect, useState } from "react";
const HomePage = () => {
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
  return (<>
    {roles.includes('director') && <>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <h1 style={{ textAlign: "center" }}></h1>
        <LineChart />
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: "center" }}>Most requested products</h2>
          <BasicPie />
        </div>
        <div style={{ flex: 1 }}>
          <BorderRadius />
        </div>
      </div>
    </div>
    </>}
    {roles.includes('rsr') && <>
   <BCIValidation></BCIValidation>
    
    </>}
    {roles.includes('consommateur') && <>
<BCIsetShowAddBCIManagement/>    
    </>}
    {roles.includes('asa') && <>
<BceManagement/>    
    </>}

    {roles.includes('administrator') && <>
<UsersManagement/>    
    </>}

    {roles.includes('magasinier') && <>
<BrManagement/>    
    </>}
    </>
  );
};

export default HomePage;
