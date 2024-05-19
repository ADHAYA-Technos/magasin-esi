
import { DataTypes } from 'sequelize';
import  Database  from '../config/Database.js';
import Consommateur from './Consommateur.js';
const MAGASINIER = Database.define(
	'MAGASINIER',
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



export default MAGASINIER;
