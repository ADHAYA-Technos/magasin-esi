// Assuming you have Sequelize imported and your sequelize instance is named "sequelize"
import { DataTypes } from 'sequelize';
import  Database from '../config/Database.js';
const PasswordResets = Database.define('PasswordResets', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  
},{
    timestamps: false,
}

);

export default PasswordResets;
