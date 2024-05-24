import { DataTypes } from 'sequelize';
import  Database from '../config/Database.js';


const ASA = Database.define(
	'ASA',
	{
       
		matricule: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);



export default ASA;
