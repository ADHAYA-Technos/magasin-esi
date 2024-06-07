import { DataTypes } from 'sequelize';
import  Database  from '../config/Database.js';
import Consommateur from './Consommateur.js';
const RSR = Database.define(
	'RSRS',
	{
		
		matricule: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		service: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		timestamps: false,
	}
);


export default RSR;
