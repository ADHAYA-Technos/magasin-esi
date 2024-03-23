import mysql from 'mysql2';
 

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'ADHAYA_TECK_1!',
  database: 'magasin-esi',
   port : 3306 
}).promise() ;


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
    try {
        const [results] = await pool.query(`
            INSERT INTO users (name, email, password) VALUES (?, ?, ?)
        `, [user.username, user.email, user.password]);

        if (results.affectedRows === 1) {
            // User successfully registered
            return true;
        } else {
            // User registration failed
            return false;
        }
    } catch (error) {
        // Check if the error is due to a duplicate entry for the email field
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('User already registered:', error);
            return 'duplicate';
        } else {
            // Handle any other errors that occur during the insertion process
            console.error('Error creating user:', error);
            return false;
        }
    }
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

  //querry takes userId as parameter and returns the roles of the user 
  async function fetchRoles(userId) {
    const [results] = await pool.query( `SELECT Roles.roleId, Roles.role
    FROM UsersRoles
    JOIN Roles ON UsersRoles.roleId = Roles.roleId
    WHERE UsersRoles.userId = ?`,
   [userId], ) 
    return results
  }

  //querry takes roleId as parameter and returns the permissions of the role
  async function fetchPermissions(roleId) {
    const [results] = await pool.query(`
      SELECT Permissions.permission
      FROM RolesPermissions
      JOIN Permissions ON RolesPermissions.permissionId = Permissions.permissionId
      WHERE RolesPermissions.roleId = ?
    `, [roleId]);
    return results.map(result => result.permission);
  }
   //querry takes permissionId as parameter and returns the functions of the permission
   async function fetchFunctions(permissionId) {
    const [results] = await pool.query(`
      SELECT Functions.functionName
      FROM Permissions
      JOIN Functions ON Permissions.permissionId = Functions.permissionId
      WHERE permissionId = ?
    `, [permissionId]);
    return results.map(result => result.permission);
  
  }
  async function loginUser(username, password) {
    try {
      const [results] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [username, password]);
      if (results.length > 0) {
        const isAdmin = results[0].isAdmin;
        return isAdmin;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; 
    }
  }
  
  export {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    fetchRoles,
    fetchPermissions,
    fetchFunctions,
    loginUser
  } ;
