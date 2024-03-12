import mysql from 'mysql2';
 

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'ADHAYA_TECK_1!',
  database: 'magasin-esi',
   port : 3306 
}).promise()


  async function getUsers() {
    const [results] = await pool.query("select * from users" ) 
    return results
  }

  async function getUser(id) {
    const [results] = await pool.query(`
    select * from users where userId =? ;
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
  

  export {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }
