
import { createTransport } from 'nodemailer';
import { v4 } from 'uuid';
import Users from '../models/User.js';
import argon2 from 'argon2'; // Import argon2 library
import UsersRoles from '../models/UserRoles.js';
import Roles from '../models/Role.js';
import PasswordResets from '../models/PasswordReset.js';
export async function createUser(req, res) {
    const { email, password: plainPassword, username :name,userType } = req.body;
    
    try {
        let user = await Users.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'Email already exists.' });

        const hashedPassword = await argon2.hash(plainPassword); // Hash password using argon2
        const verificationKey = v4();
        const verificationDate = new Date();
        
        user = await Users.create({
            email,
            password: hashedPassword, 
            name,
            verificationKey,
            verificationDate,
        });

        // Create user's roles based on userType
        let rolesToCreate = [];
        switch (userType) {
            case 'administrator':
                rolesToCreate.push('administrator');
                break;
            case 'consommateur':
                rolesToCreate.push('consommateur');
                break;
            case 'director':
                rolesToCreate.push('director');
                break;
            case 'asa':
                rolesToCreate.push('asa');
                break;
            case 'rsr':
                rolesToCreate.push('rsr');
                break;
            case 'magasinier':
                rolesToCreate.push('magasinier');
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        // Find or create roles and insert rows into UserRoles table
        const createdRoles = await Promise.all(rolesToCreate.map(async (roleName) => {
            const [role, created] = await Roles.findOrCreate({
                where: { role: roleName },
                defaults: { role: roleName },
            });
            if (created) {
                // If the role was newly created, insert a row into UserRoles table
                await UsersRoles.create({ userId: user.userId, roleId: role.roleId });
            } else {
                // If the role already existed, check if the user has this role
                const userRole = await UsersRoles.findOne({ where: { userId: user.userId, roleId: role.roleId } });
                if (!userRole) {
                    // If the user doesn't have this role, insert a row into UserRoles table
                    await UsersRoles.create({ userId: user.userId, roleId: role.roleId });
                }
            }
            return role;
        }));

        // Send email verification
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
            subject: 'ESI SMART STORE verification key',
            html: `<p>Click this link to verify your account:<a href="http://localhost:3000/verify-email?key=${verificationKey}">Verify Email Address</a></p>`,
        });

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function verifyUser(req, res) {
    const { key: verificationKey } = req.query;
    
    try {
        const user = await Users.findOne({ where: { verificationKey } });
        if (!user) return res.status(404).json({ message: 'No user found' });

        user.set({ isVerified: true });
        await user.save();
        
        return res.status(200).json({ message: 'Email verified' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function completeUser(req, res) {
    const { email } = req.user;
    
    const { matricule, address, telephone, userType, service } = req.body;

    if (!matricule || !address || !telephone || !userType || !service) {
        console.log( req.body)
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.set({ address, telephone, userType,service });

        switch (userType) {
            case 'consommateur':
                if (!service) return res.status(400).json({ message: 'All fields are required' });
                await user.createConsommateur({ matricule, service });
                break;
            case 'rsr':
                if (!service) return res.status(400).json({ message: 'All fields are required' });
                await user.createRSR({ matricule, service });
                break;
            case 'director':
                await user.createDirector({ matricule });
                break;
            case 'magasinier':
                await user.createMAGASINIER({ matricule });
                break;
            case 'asa':
                await user.createASA({ matricule });
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        user.set({ isCompleted: true });
        await user.save();

        return res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Function to handle password reset request
export async function requestPasswordReset(req, res) {
    const { email } = req.body;
    
    try {
        // Find the user by email
        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate a unique token
        const resetToken = v4();

        // Save the token in the database
        await PasswordResets.create({ email, token: resetToken });

        // Send the reset password link to the user's email
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
            subject: 'ESI SMART STORE "Password Reset Request"',
            html: `<p>Click this link to reset your password: <a href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a></p>`,
        });

        return res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Function to handle password reset
export async function resetPassword(req, res) {
    const { token, password } = req.body;

    try {
        // Find the token in the database
        const resetRecord = await PasswordResets.findOne({ where: { token } });
        if (!resetRecord) return res.status(404).json({ message: 'Invalid token' });

        // Find the user by email
        const user = await Users.findOne({ where: { email: resetRecord.email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update user's password
        const hashedPassword = await argon2.hash(password);
        user.set({ password: hashedPassword });
        await user.save();

        // Delete the token record from the database
        await resetRecord.destroy();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default { createUser, verifyUser, completeUser, requestPasswordReset, resetPassword };