import express from "express";
import nodemailer from 'nodemailer';
import {  getUsers, getUser,createUser,updateUser,deleteUser ,loginUser,fetchRoles,fetchPermissions,fetchFunctions} from "./database.js";
const app = express()
const port = 5000
app.set("view engine", "ejs")
app.use(express.static("public")) 
app.use(express.json());

// Create a nodemailer transporter
/*const transporter = nodemailer.createTransport({
  
  service: 'gmail',
  auth: {
      user: 'email@gmail.com',
      pass: 'password',
  },
});*/

// Handle user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
      // Save the user to the database
      const result = await createUser({ username, email, password });

      if (result === true) {
          // User registered successfully
          res.json({ success: true });
            // Send confirmation email to the user
     /* await transporter.sendMail({
          from: 'yacinmca32000@gmail.com',
          to: email,
          subject: 'ESI-STORE | Registration Confirmation',
          text: 'Thank you for registering. Your registration will be processed by the admin.',
      });*/
      } else if (result === 'duplicate') {
          // User is already registered
          res.json({ success: false, message: 'User already registered.' });
      } else {
          // User registration failed due to an error
          res.status(500).json({ success: false, error: 'An error occurred during registration.' });
      }
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, error: 'An error occurred during registration.' });
  }
});

 //login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const isAdmin = await loginUser(email, password);
    if (isAdmin !== null) {
      res.json({ isAdmin });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
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