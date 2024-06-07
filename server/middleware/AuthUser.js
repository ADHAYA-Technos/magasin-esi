import Users from "../models/User.js";

// Middleware to verify if user is authenticated
export const verifyUser = async (req, res, next) => {
    console.log(req.session);
    // Check if userId exists in the session
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please login to your account!" });
    }

    try {
        // Find user by userId in the database
        const user = await Users.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        
        // If user not found, respond with error
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Set userId and role in request for further use
        req.userId = user.userId;
        req.role = user.role;
        
        // Proceed to next middleware/route handler
        next();
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

// Middleware to allow access only to admin users
export const adminOnly = async (req, res, next) => {
    try {
        // Find user by userId in the database
        const user = await Users.findOne({
            where: {
                uuid: req.session.userId
            }
        });
        
        // If user not found, respond with error
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if user is admin
        if (user.role !== "admin") {
            return res.status(403).json({ msg: "Forbidden access" });
        }
        
        // Proceed to next middleware/route handler
        next();
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ msg: "Internal Server Error" });
    }
}
