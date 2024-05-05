import { Sequelize } from "sequelize";
import Database from "../config/Database.js";
import UsersRoles from "./userRoleModel.js"; // Import the UsersRoles model first
import Roles from "./roleModel.js"; // Then import the Roles model

const { DataTypes } = Sequelize;

const Users = Database.define('Users', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    }
}, {
    freezeTableName: true
});



export default Users;
