import { DataTypes } from 'sequelize';
import  Database  from '../config/Database.js';
import Consommateur from './Consommateur.js';
const Structure = Database.define(
	'Structure',
	{
		structureId: {
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true,
            }
			
		} ,
        structureName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 100]
            }
        }
	},
	{
		timestamps: false,
	}
);



export default Structure;
