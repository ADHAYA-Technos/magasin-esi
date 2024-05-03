import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const Database = new Sequelize({
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
});

export default Database;
