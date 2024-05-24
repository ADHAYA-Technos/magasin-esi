import { DataTypes } from 'sequelize';
import  Database from '../config/Database.js';


const Consommateur = Database.define(
	'Consommateur',
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



export default Consommateur;
