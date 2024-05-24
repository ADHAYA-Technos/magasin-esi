import { DataTypes } from 'sequelize';
import Database  from '../config/Database.js';


const Director = Database.define(
	'Director',
	{
		matricule: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        timestamps: false,
	},
	{
		timestamps: false,
	}
);



export default Director;
