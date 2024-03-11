import mysql from 'mysql2';

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

  async function getUsers() {
    const [results] = await pool.query("select * from users" ) 
    return results
  }

  async function getUser(id) {
    const [results] = await pool.query(`
    select * from users where userId =? 
    `,[id])  // don't use ${ id } in the query, it's not safe || lead to sql injection 
    return results[0]
  } 


  async function createUser(user) {
    const [results] = await pool.query(`
    insert into users (name, email) values (?, ?)
    `, [user.name, user.email]) 
    return results
  }
  
  async function updateUser(id, user) {
    const [results] = await pool.query(`
    update users set name = ?, email = ? where userId = ?
    `, [user.name, user.email, id]) 
    return results
  }
  
  async function deleteUser(id) {
    const [results] = await pool.query(`
    delete from users where userId = ?
    `, [id]) 
    return results
  }
  

  export default {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }
