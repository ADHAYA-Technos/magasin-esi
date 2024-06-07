 import argon2 from 'argon2';
import { v4 } from 'uuid';
import { createTransport } from 'nodemailer';
import Users from '../models/User.js';
import Roles from '../models/Role.js';
import ASA from '../models/ASA.js';
import Director from '../models/Director.js';
import Magasinier from '../models/Magasinier.js';
import RSR from '../models/RSR.js';
import Consommateur from '../models/Consommateur.js';

export async function createUser(req, res) {
    try {
        const { email, password: plainPassword, userType, name, address, telephone, structure, roles, matricule, service } = req.body;
        console.log(req.body);
        if (!userType || !name  || !telephone || !roles.length ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let user = await Users.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const password = await argon2.hash(plainPassword);
        const verificationKey = v4();
        const verificationDate = new Date();

        user = await Users.create({
            email,
            password,
            verificationKey,
            verificationDate,
            userType,
            name,
            address,
            telephone,
            structure,
            isVerified: true,
            isActive: true,
            isCompleted: true,
            isBlocked: false,
            service
        });

        const newRolesIds = await Promise.all(
            roles.map(async (role) => {
                const roleRecord = await Roles.findOne({ where: { role } });
                return roleRecord.roleId;
            })
        );
        await user.setRoles(newRolesIds);

        switch (userType) {
            case 'consommateur':
                if (!matricule || !service) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                await user.createConsommateur({ matricule, service });
                break;
            case 'rsr':
                if (!matricule || !service) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                await user.createRSR({ matricule, service });
                break;
            case 'director':
                if (!matricule) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                await user.createDirector({ matricule });
                break;
            case 'magasinier':
                if (!matricule) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                await user.createMagasinier({ matricule });
                break;
            case 'asa':
                if (!matricule) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                await user.createASA({ matricule });
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        const transporter = createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: 'adhaya.es3@zohomail.com',
                pass: 'bUzGBC7W.AN@VjR',
            },
        });

        await transporter.sendMail({
            from: 'adhaya.es3@zohomail.com',
            to: email,
            subject: 'ESI-SMART-STORE account',
            html: `<p>You now have an ES3 account:</p>
                   <p>Email: ${email}</p>
                   <p>Password: ${plainPassword}</p>`,
        });

        return res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// MODIFY USER
export async function modifyUser(req, res) {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { userType, name, address, telephone, roles } = req.body || user.dataValues;

        await user.update({
            userType,
            name,
            address,
            telephone
        });

        if (userType === 'consommateur') {
            const consommateur = await user.getConsommateur();
            const { matricule ,service } = req.body || consommateur.dataValues;
            await consommateur.update({ matricule ,service });
        } else if (userType === 'rsr') {
            const rsr = await user.getRSR();
            const {matricule, service } = req.body || rsr.dataValues;
            await rsr.update({matricule, service });
        }else if (userType === 'asa') {
            const asa = await user.getASA();
            const {matricule, service } = req.body || asa.dataValues;
            await asa.update({matricule, service });
        }else if (userType === 'director') {
            const director = await user.getDirector();
            const {matricule } = req.body || director.dataValues;
            await director.update({matricule, service });
        }else if (userType === 'magasinier') {
            const magasinier = await user.getMagasinier();
            const {matricule } = req.body || magasinier.dataValues;
            await magasinier.update({matricule });
        }

        const newRolesIds = await Promise.all(
            roles.map(async (role) => {
                const roleRecord = await Roles.findOne({ where: { role } });
                return roleRecord.roleId;
            })
        );
        await user.setRoles(newRolesIds);

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// DELETE USER
export async function deleteUser(req, res) {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.destroy();
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// GET USER BY ID
export async function getUserById(req, res) {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// GET USERS
export async function getUsers(req, res) {
    try {
        let users = await Users.findAll();
        if (!users.length) return res.status(404).json({ message: 'No users found' });

        users = await Promise.all(
            users.map(async (user) => {
                const type = user.dataValues.userType;
                const infos = type === 'consommateur'
                    ? await user.getConsommateur()
                    : type === 'rsr'
                        ? await user.getRSR()
                        : type === 'asa'
                            ? await user.getASA() :
                               type === 'magasinier'?await user.getMagasinier() : 
                                     await user.getDirector();
                return {
                    ...user.dataValues,
                    roles: await user.getRoles(),
                    infos
                };
            })
        );

        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// ACTIVATE USER
export async function activateUser(req, res) {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).send('User not found');
        user.set({ isActive: true });
        await user.save();
        return res.send('User activated successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// DEACTIVATE USER
export async function deactivateUser(req, res) {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).send('User not found');
        user.set({ isActive: false });
        await user.save();
        return res.send('User deactivated successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// CREATE ROLE
export async function createRole(req, res) {
    try {
        const { role } = req.body;
        let roleInstance = await Roles.findOne({ where: { role } });
        if (roleInstance) {
            return res.status(400).json({ message: 'Role already exists' });
        }
        roleInstance = await Roles.create({ role });
        return res.status(200).json({ message: 'Role created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// MODIFY ROLE
export async function modifyRole(req, res) {
    try {
        let roleInstance = await Roles.findOne({ where: { role: req.body.role } });
        if (!roleInstance) return res.status(404).json({ message: 'Role not found' });

        const { role, color } = req.body || roleInstance.dataValues;
        await roleInstance.update({ role, color });
        return res.status(200).json({ message: 'Role modified successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// DELETE ROLE
export async function deleteRole(req, res) {
    try {
        const role = await Roles.findByPk(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        await role.destroy();
        return res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// GET ROLES
export async function getRoles(req, res) {
    try {
        let roles = await Roles.findAll();
        if (!roles.length) return res.status(404).json({ message: 'No roles found' });

        roles = await Promise.all(
            roles.map(async (role) => {
                const [membersCount, permission] = await Promise.all([
                    role.countUsers(), // Assuming there's a `Users` model associated
                    role.getPermissions(), // Fetch permissions for the role
                ]);
                return {
                    id: role.roleId,
                    name: role.role,
                    color: role.dataValues.color,
                    members: membersCount,
                    permissions: permission.map(permission => permission.permission), // Adjust as needed
                };
            })
        );

        return res.status(200).json(roles);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// GET ROLE BY ID
export async function getRoleById(req, res) {
    try {
        const role = await Roles.findOne({ where: { roleId: req.params.id } });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        return res.status(200).json(role);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// ADD ROLES TO USER
export async function addRoles(req, res) {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).send('User not found');

        let { roles } = req.body;
        if (!Array.isArray(roles)) roles = [roles];

        const roleRecords = await Promise.all(
            roles.map(role => Roles.findOne({ where: { role } }))
        );
        const roleIds = roleRecords.map(role => role.roleId);

        await user.addRoles(roleIds);
        return res.send('Roles added successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// REMOVE ROLES FROM USER
export async function removeRoles(req, res) {
    try {
        const user = await Users.findByPk(req.params.id);
        if (!user) return res.status(404).send('User not found');

        let { roles } = req.body;
        if (!Array.isArray(roles)) roles = [roles];

        const roleRecords = await Promise.all(
            roles.map(role => Roles.findOne({ where: { role } }))
        );
        const roleIds = roleRecords.map(role => role.roleId);

        await user.removeRoles(roleIds);
        return res.send('Roles removed successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    createUser,
    modifyUser,
    deleteUser,
    getUserById,
    getUsers,
    activateUser,
    deactivateUser,
    createRole,
    modifyRole,
    deleteRole,
    getRoles,
    getRoleById,
    addRoles,
    removeRoles
};
