import { Sequelize } from "sequelize";
import Database from "../config/Database.js";
const { DataTypes } = Sequelize;
import Roles from "./Role.js";
import Users from "./User.js";
const UsersRoles = Database.define('UsersRoles', {
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
    timestamps: false
});
Roles.belongsToMany(Users, {
    through: 'UsersRoles',
    foreignKey: 'roleId', // Specify the foreign key column name for Roles
    otherKey: 'userId' // Specify the foreign key column name for Users
});

Users.belongsToMany(Roles, {
    through: 'UsersRoles',
    foreignKey: 'userId', // Specify the foreign key column name for Users
    otherKey: 'roleId' // Specify the foreign key column name for Roles
});

UsersRoles.belongsTo(Roles, { foreignKey: 'roleId' });
UsersRoles.belongsTo(Users, { foreignKey: 'userId' });

export default UsersRoles;
