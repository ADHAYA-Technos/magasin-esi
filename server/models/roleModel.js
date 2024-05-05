import { Sequelize } from "sequelize";
import Database from "../config/Database.js";
import Users from "./userModel.js";
const { DataTypes } = Sequelize;

 const Roles = Database.define('Roles', { // Use 'Roles' instead of 'Users' for defining the model
    roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    }
}, {
    freezeTableName: true
});

Roles.belongsToMany(Users, { 
    through: 'UsersRoles', // Intermediate table name
    foreignKey: 'roleId', // Foreign key in the intermediate table referring to Roles
    otherKey: 'userId' // Foreign key in the intermediate table referring to Users
});

Users.belongsToMany(Roles, { 
    through: 'UsersRoles', // Intermediate table name
    foreignKey: 'userId', // Foreign key in the intermediate table referring to Users
    otherKey: 'roleId' // Foreign key in the intermediate table referring to Roles
});

export default Roles;