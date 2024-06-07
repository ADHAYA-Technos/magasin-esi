import { DataTypes } from 'sequelize';
import Database from "../config/Database.js";

const Permission =Database.define(
	'Permission',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		permission: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);


export default Permission;
