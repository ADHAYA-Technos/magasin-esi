import Roles from "../models/Role.js";
import Users from "../models/User.js";
import UserRole from "../models/UserRoles.js"; // Import the UserRole model if you created one
import argon2 from "argon2";
import {uploadAttachement , uploadPicture} from '../middleware/uploadAttachement.js';
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            include: {
                model: Roles, // Assuming you named your Role model 'Role'
                attributes: ['roleId', 'roleName'], // Adjust attributes as needed
                through: { attributes: [] } // Exclude junction table attributes
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                userId: req.params.id
            },
            include: {
                model: Roles,
                attributes: ['roleId', 'roleName'],
                through: { attributes: [] }
            }
        });
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createUser = async (req, res) => {
  
    const { name, email, password, confPassword, roles ,data } = req.body;

    if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    const hashPassword = await argon2.hash(password);
    try {
        const newUser = await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });
        if (roles && roles.length > 0) {
            await newUser.setRoles(roles); // Assuming you have a setter method 'setRoles' in your User model
        }
        
            // Upload the file to the server
            


        
        res.status(201).json({ msg: "User created successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { name, email, password, confPassword, roles } = req.body;
    let hashPassword;
    if (password !== "" && password !== null) {
        if (password !== confPassword) return res.status(400).json({ msg: "Password and Confirm Password do not match" });
        hashPassword = await argon2.hash(password);
    }
    try {
        const user = await Users.findOne({
            where: {
                userId: req.params.id
            }
        });
        if (!user) return res.status(404).json({ msg: "User not found" });
        await Users.update({
            name: name,
            email: email,
            password: hashPassword || user.password
        });
        if (roles && roles.length > 0) {
            await user.setRoles(roles); // Update user's roles
        }
        res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                userId: req.params.id
            }
        });
        if (!user) return res.status(404).json({ msg: "User not found" });
        await user.destroy();
        res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
