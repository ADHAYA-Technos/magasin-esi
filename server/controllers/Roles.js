import Role from "../models/Role.js";
import User from "../models/User.js"; // Assuming you need to manage roles associated with users

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: {
                roleId: req.params.id
            }
        });
        if (!role) return res.status(404).json({ msg: "Role not found" });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createRole = async (req, res) => {
    const { roleName } = req.body;
    try {
        const newRole = await Role.create({
            roleName: roleName
        });
        res.status(201).json({ msg: "Role created successfully", role: newRole });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateRole = async (req, res) => {
    const { roleName } = req.body;
    try {
        const role = await Role.findOne({
            where: {
                roleId: req.params.id
            }
        });
        if (!role) return res.status(404).json({ msg: "Role not found" });
        await role.update({
            roleName: roleName
        });
        res.status(200).json({ msg: "Role updated successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findOne({
            where: {
                roleId: req.params.id
            }
        });
        if (!role) return res.status(404).json({ msg: "Role not found" });

        // Check if any users are associated with this role before deletion
        const usersWithRole = await User.findAll({
            where: {
                roleId: role.roleId
            }
        });
        if (usersWithRole.length > 0) {
            return res.status(400).json({ msg: "Cannot delete role as there are users associated with it" });
        }

        await role.destroy();
        res.status(200).json({ msg: "Role deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}
