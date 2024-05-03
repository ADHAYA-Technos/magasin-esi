import { Sequelize } from "sequelize";
import Database from "../config/Database.js";
const { DataTypes } = Sequelize;

const UserRole = Database.define('UsersRoles', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Users', // Name of the referenced model
            key: 'userId' // Name of the referenced column
        }
    },
    roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Roles', // Name of the referenced model
            key: 'roleId' // Name of the referenced column
        }
    }
}, {
    freezeTableName: true
});

export default UserRole;
