import Users from "../models/userModel.js";
import UserRole from "../models/userRoleModel.js"; // Assuming you have a UserRoles model
import Roles from "../models/roleModel.js"; // Assuming you have a Role model
import argon2 from "argon2";

// Controller for user authentication
const AuthController = {
  // Login endpoint
  login: async (req, res) => {
    try {
      const user = await Users.findOne({
        where: {
          email: req.body.email
        }
      });

      // Check if user exists
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify password
      const match = await argon2.verify(user.password, req.body.password);
      if (!match) {
        return res.status(400).json({ msg: "Wrong password" });
      }

      // Find roles associated with the user
      const userRoles = await UserRole.findAll({
        where: {
          userId: user.userId
        },
        include: Roles // Include the Role model to get role details
      });

      // Extract role names from userRoles
      const roles = userRoles.map(userRole => userRole.role.name);

      // Set session userId
      req.session.userId = user.uuid;

      // Send user data along with roles in response
      const { userId, name, email } = user;
      res.status(200).json({ userId, name, email, roles });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Me endpoint
  me: async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ msg: "Please log in to your account" });
      }

      const user = await Users.findOne({
        attributes: ['uuid', 'name', 'email'],
        where: {
          uuid: req.session.userId
        }
      });

      // Check if user exists
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error in me:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Logout endpoint
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(400).json({ msg: "Unable to logout" });
      }
      res.status(200).json({ msg: "You have been logged out" });
    });
  }
};

export default AuthController;
