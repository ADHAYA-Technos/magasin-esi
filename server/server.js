import express from "express";
import {  getUsers, getUser,createUser,updateUser,deleteUser ,fetchRoles,fetchPermissions,fetchFunctions} from "./database.js";
const app = express()
const port = 5000
app.set("view engine", "ejs")
app.use(express.static("public"))
 

//fetch roles then permissions then functions
app.get('/api', async (req, res) => {
  try {
    const userId = 3; // Replace with the actual user ID
    const userRoles = await fetchRoles(userId);
    const rolesWithPermissions = [];

  
    for (const role of userRoles) {
      const permissions = await fetchPermissions(role.roleId);
      rolesWithPermissions.push({
        roleId: role.roleId,
        role: role.role,
        permissions: permissions
      });
    }

    res.json(rolesWithPermissions);
  } catch (error) {
    console.error("Error fetching user roles and permissions:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`)
})