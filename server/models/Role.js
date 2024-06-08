import { Sequelize } from "sequelize";
import Database from "../config/Database.js";
import Permission from "./Permission.js";
const { DataTypes } = Sequelize;

 const Roles = Database.define('Roles', { // Use 'Roles' instead of 'Users' for defining the model
    roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true, 
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
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: false
});


const PermissionsRoles = Database.define('PermissionsRoles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,

    },
    roleId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    timestamps: false,
});


Roles.belongsToMany(Permission, { through: 'PermissionsRoles', foreignKey: 'roleId' });
Permission.belongsToMany(Roles, { through: 'PermissionsRoles', foreignKey: 'id' });

export default Roles;