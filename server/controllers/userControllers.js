import mysql from 'mysql2';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
let connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'ADHAYA_TECK_1!',
  database: 'magasin-esi',
   port : 3306 
  });
  
  // View Users
  export const view = (req, res) => {
    // User the connection
    connection.query('SELECT * FROM users  ', (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        
        res.render('home', { rows });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  }
  
  // Find User by Search
  export const find = (req, res) => {
    let searchTerm = req.body.search;
    // User the connection
    connection.query('SELECT * FROM users WHERE name LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
      if (!err) {
        res.render('home', { rows });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  }
  
  export const form = (req, res) => {
    res.render('add-user');
  }
  
  // Add new user

  export const create = async (req, res) => {
    const { first_name, last_name, email, password:plainPassword, phone, role } = req.body;
    const userId = uuidv4(); // Generate a UUID for userId
    const hashedPassword = await argon2.hash(plainPassword);
    const verificationKey = uuidv4();
    const verificationDate = new Date();
    // First, insert the user with the generated UUID
    connection.query(
      'INSERT INTO users (userId, name, email, password, telephone, structureId,verificationKey,verificationDate) VALUES (?, concat(?, ?), ?, ?, ?, ?,?,?)',
      [userId, first_name, last_name, email, hashedPassword, phone, 1,verificationKey,verificationDate],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
  
        // Retrieve the roleId based on the selected role
        connection.query(
          'SELECT roleId FROM roles WHERE role = ?',
          [role],
          (err, rows) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
  
            if (rows.length === 0) {
              return res.status(400).send('Invalid role selected');
            }
  
            const roleId = rows[0].roleId;
  
            // Insert the user's role into usersroles
            connection.query(
              'INSERT INTO usersroles (userId, roleId) VALUES (?, ?)',
              [userId, roleId],
              (err, rows) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send('Internal Server Error');
                }
  
                res.render('add-user', { alert: 'User added successfully.' });
              }
            );
          }
        );
      }
    );
  };

  
  export const update = (req, res) => {
    const userId = req.params.id;
    const {email,address, telephone, roles } = req.body;
  
    const updateUserQuery = 'UPDATE users SET telephone = ?, email = ?,address=? WHERE userId = ?';
    const deleteUserRolesQuery = 'DELETE FROM usersroles WHERE userId = ?';
    const insertUserRoleQuery = 'INSERT INTO usersroles (userId, roleId) VALUES (?, ?)';
  
    connection.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      connection.query(updateUserQuery, [telephone, email,address, userId], (err) => {
        if (err) {
          return connection.rollback(() => {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });
        }
  
        connection.query(deleteUserRolesQuery, [userId], (err) => {
          if (err) {
            return connection.rollback(() => {
              console.error(err);
              res.status(500).send('Internal Server Error');
            });
          }
  
          const roleQueries = Array.isArray(roles)
            ? roles.map((roleId) => new Promise((resolve, reject) => {
                connection.query(insertUserRoleQuery, [userId, roleId], (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              }))
            : [];
  
          Promise.all(roleQueries)
            .then(() => {
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                  });
                }
                res.redirect(`/viewuser/${userId}`);
              });
            })
            .catch((err) => {
              connection.rollback(() => {
                console.error(err);
                res.status(500).send('Internal Server Error');
              });
            });
        });
      });
    });
  };
  export const edit = (req, res) => {
    const userId = req.params.id;
  
    const userQuery = 'SELECT * FROM users WHERE userId = ?';
    const rolesQuery = `
      SELECT r.roleId, r.role, ur.userId IS NOT NULL AS assigned
      FROM roles r
      LEFT JOIN usersroles ur ON r.roleId = ur.roleId AND ur.userId = ?
    `;
  
    connection.query(userQuery, [userId], (err, userRows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      connection.query(rolesQuery, [userId], (err, rolesRows) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
  
        console.log('User Rows:', userRows); // Add this line
        console.log('Roles Rows:', rolesRows); // Add this line
  
        res.render('edit-user', { user: userRows, roles: rolesRows });
      });
    });
  };
  

  // Function to delete user and associated records
  export const deleteUserAndAssociations = (userId, res) => {
    // Begin transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      const deleteQueries = [
        'DELETE FROM usersroles WHERE userId = ?',
        'DELETE FROM bci WHERE userId = ?',
        'DELETE FROM bdr WHERE userId = ?',
        'DELETE FROM bsr WHERE userId = ?',
        'DELETE FROM consommateurs WHERE userId = ?',
        'DELETE FROM directors WHERE userId = ?',
        'DELETE FROM asa WHERE userId = ?',
        'DELETE FROM rsr WHERE userId = ?',
        'DELETE FROM users WHERE userId = ?',
      ];
  
      // Execute all delete queries
      Promise.all(
        deleteQueries.map((query) => new Promise((resolve, reject) => {
          connection.query(query, [userId], (err, results) => {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        }))
      ).then(() => {
        // Commit transaction
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              console.error(err);
              res.status(500).send('Internal Server Error');
            });
          }
          res.redirect('/?removed=User successfully removed.');
        });
      }).catch((err) => {
        // Rollback transaction in case of error
        connection.rollback(() => {
          console.error(err);
          res.status(500).send('Internal Server Error');
        });
      });
    });
  };
  
  // Function to handle user deletion request
  export const deleteUser = (req, res) => {
    const userId = req.params.id;
  
    // Check if the user has traces in the relevant tables
    const checkTracesQuery = `
      SELECT
        (SELECT COUNT(*) FROM bci WHERE userId = ?) AS bciCount,
        (SELECT COUNT(*) FROM bdr WHERE userId = ?) AS bdrCount,
        (SELECT COUNT(*) FROM bsr WHERE userId = ?) AS bsrCount,
        (SELECT COUNT(*) FROM consommateurs WHERE userId = ?) AS consommateursCount,
        (SELECT COUNT(*) FROM directors WHERE userId = ?) AS directorsCount,
        (SELECT COUNT(*) FROM asa WHERE userId = ?) AS asaCount,
        (SELECT COUNT(*) FROM rsr WHERE userId = ?) AS rsrCount
    `;
  
    connection.query(checkTracesQuery, [userId, userId, userId, userId, userId, userId, userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      const { bciCount, bdrCount, bsrCount, consommateursCount, directorsCount, asaCount, rsrCount } = results[0];
  
      if (bciCount > 0 || bdrCount > 0 || bsrCount > 0 || consommateursCount > 0 || directorsCount > 0 || asaCount > 0 || rsrCount > 0) {
        // User has traces in one or more tables
        const confirmationMessage = `User has traces in the database (BCI: ${bciCount}, BDR: ${bdrCount}, BSR: ${bsrCount}, Consommateurs: ${consommateursCount}, Directors: ${directorsCount}, ASA: ${asaCount}, RSR: ${rsrCount}). Deleting this user will delete all associated records. Do you want to proceed?`;
        res.render('confirm-delete', { message: confirmationMessage, userId });
      } else {
        // Proceed with deletion
        deleteUserAndAssociations(userId, res);
      }
    });
  };
  
  // View Users
  export const viewall = (req, res) => {
  
    // User the connection
    connection.query('SELECT * FROM users WHERE userId = ?', [req.params.id], (err, rows) => {
      if (!err) {
        res.render('view-user', { rows });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  
  }
  export default { view, find, form, create, edit, update, viewall,deleteUser,deleteUserAndAssociations};