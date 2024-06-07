import { Sequelize } from "sequelize";
import Database from "../config/Database.js";
import Consommateur from "./Consommateur.js";
import Director from "./Director.js";
import RSR from "./RSR.js";
import ASA from "./ASA.js";
import Structure from "./Structure.js";


const { DataTypes } = Sequelize;

const Users = Database.define('Users', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true, // Specify this as the primary key
        validate: {
            notEmpty: true,
        }
    },
    name: {
        type: DataTypes.STRING,
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
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
        defaultValue: null,
    },
    address: {
        type: DataTypes.STRING(128),
        allowNull: true,
        defaultValue: null,
    },
    telephone: {
        type: DataTypes.STRING(13),
        allowNull: true,
        validate: {
            is: /\+213[5-7][0-9]{8}/,
        },
        defaultValue: null,
    },
    userType: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    verificationKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    verificationDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    structureId: {  // Add this field
        type: DataTypes.INTEGER,
        allowNull:true,
        references: {
            model: Structure, // Reference to the Structure model
            key: 'id'  // Assuming 'id' is the primary key of the Structure model
        }},
        service: {
            type: DataTypes.STRING(120),
            allowNull: true,
        },
}, {
   
    timestamps: false
});


Users.hasOne(ASA, { foreignKey: 'userId' });
ASA.belongsTo(Users, { foreignKey: 'userId' });

Users.hasOne(Director, { foreignKey: 'userId' });
Director.belongsTo(Users, { foreignKey: 'userId' });

Users.hasOne(Consommateur, { foreignKey: 'userId' });
Consommateur.belongsTo(Users, { foreignKey: 'userId' });

Users.hasOne(RSR, { foreignKey: 'userId' });
RSR.belongsTo(Users, { foreignKey: 'userId' });

Users.belongsTo(Structure, { foreignKey: 'structureId' });
Structure.hasMany(Users, { foreignKey: 'structureId' });

export default Users;
