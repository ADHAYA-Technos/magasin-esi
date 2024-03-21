import React, { useEffect, useState } from 'react';

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';


export const Admin = () => {
  const [rolesWithPermissions, setRolesWithPermissions] = useState([]);

  useEffect(() => {
    
    // Replace with the actual user ID
    fetch(`/api`)
      .then(res => res.json())
      .then(data => setRolesWithPermissions(data))
      .catch(error => console.error('Error fetching user permissions:', error));
  }, []);

  return (
    <Sidebar>
      
      
      
      <Menu>
      {rolesWithPermissions.map(role => 
      role.permissions.map(permissions => (
        <SubMenu key={permissions} label={permissions}></SubMenu>
          )
            
        
      ))}
    </Menu>
  </Sidebar>

  )
}
export default Admin ;