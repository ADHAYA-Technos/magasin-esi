//capfControllers
import mysql from "mysql2";

let connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "ADHAYA_TECK_1!",
  database: "magasin-esi",
  port: 3306,
});

export const fetchChapitres = (callback) => {
  connection.query(
    "SELECT chapitreId, numChapitre, libelle FROM Chapitres",
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};
export const fetchArticlesByChapitre = (chapitreId, callback) => {
  connection.query(
    "SELECT articleId, designation ,code FROM Articles WHERE chapitreId = ?",
    [chapitreId],
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};
export const fetchFournisseursByArticle = (articleId, callback) => {
  connection.query(
    "SELECT * FROM Fournisseurs F INNER JOIN Fournisseur_Article FA ON F.fournisseurId = FA.fournisseurId WHERE FA.articleId = ?",
    [articleId],
    (error, results) => {
      if (!error) {
        callback(null, results); // Send the results back as the response
      } else {
        callback(error); // Send the error back if there's any
      }
    }
  );
};
export const fetchProductsByArticle = (articleId, callback) => {
  connection.query(
    "SELECT productId ,designation FROM Products  WHERE articleId = ?",
    [articleId],
    (error, results) => {
      if (!error) {
        callback(null, results); // Send the results back as the response
      } else {
        callback(error); // Send the error back if there's any
      }
    }
  );
};

// Function to create a new bon
export const createBon = (
  chapitreId,
  articleId,
  fournisseurId,
  type,
  dateCreation
) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO chapitres (type, chapitreId, articleId, fournisseurId,dateCreation) VALUES (?, ?, ?, ?,?)",
      [type, chapitreId, articleId, fournisseurId, dateCreation],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId); // Resolve with the ID of the newly created bon
        }
      }
    );
  });
};

// Function to insert rows into Commande table
export const createCommandeRows = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return Promise.reject("Products array is empty or not an array");
  }

  const values = products.map((product) => [
    product.bonId,
    product.productId,
    product.quantity,
    product.pu,
    product.leftQuantity,
    product.deliveredQuantity,
  ]);
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO Commande (bonId, productId, quantity, pu, leftQuantity,deliveredQuantity) VALUES ?",
      [values],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results); // Resolve with the results of the insertion
        }
      }
    );
  });
};
// Fetch commandes by bonId
export const fetchCommandesByBon = (bonId, callback) => {
  connection.query(
    `SELECT co.commandeId, p.designation, co.quantity, co.pu, co.leftQuantity, co.deliveredQuantity
    FROM Commande co
    JOIN Products p ON co.productId = p.productId
    WHERE co.bonId = ?`,
    [bonId],
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};

// fetch bons
// Modify the database query function to fetch bons with associated details
export const fetchBonsWithDetails = (callback) => {
  connection.query(
    `
      SELECT b.bonId, c.numChapitre, a.designation, b.dateCreation, f.raisonSociale,
             SUM(co.pu * co.quantity) AS totalPu,
             IF(SUM(co.quantity) > 0, SUM(co.deliveredQuantity) / SUM(co.quantity), 0) AS recieved
      FROM Bon b
      JOIN Chapitres c ON b.chapitreId = c.chapitreId
      JOIN Articles a ON b.articleId = a.articleId
      JOIN Fournisseurs f ON b.fournisseurId = f.fournisseurId
      LEFT JOIN Commande co ON b.bonId = co.bonId
      GROUP BY b.bonId;
    `,
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};

//delete bons
export const deleteBons = (bonIds) => {
  return new Promise((resolve, reject) => {
    if (!bonIds || bonIds.length === 0) {
      // If bonIds array is empty or undefined, resolve without performing deletion
      resolve();
    } else {
      connection.beginTransaction((error) => {
        if (error) {
          reject(error);
        } else {
          // Delete related commands first
          connection.query(
            "DELETE FROM commande WHERE bonId IN (?)",
            [bonIds],
            (error, results) => {
              if (error) {
                connection.rollback(() => {
                  reject(error);
                });
              } else {
                // If commands are deleted successfully, proceed to delete Bons
                connection.query(
                  "DELETE FROM Bon WHERE bonId IN (?)",
                  [bonIds],
                  (error, results) => {
                    if (error) {
                      connection.rollback(() => {
                        reject(error);
                      });
                    } else {
                      // Commit the transaction if everything is successful
                      connection.commit((error) => {
                        if (error) {
                          connection.rollback(() => {
                            reject(error);
                          });
                        } else {
                          resolve(); // Resolve without any data (successful deletion)
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  });
};

export const updateBon = (bonId, updatedBonData, updatedCommandesData) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        reject(err);
        return;
      }
      // Get chapitreId from Chapitres table where numChapitre matches
      connection.query(
        "SELECT chapitreId FROM Chapitres WHERE numChapitre = ?",
        [updatedBonData.numChapitre],
        (error, results) => {
          if (error) {
            connection.rollback(() => {
              reject(error);
            });
          } else {
            if (results.length === 0) {
              connection.rollback(() => {
                reject(new Error("Chapitre not found"));
              });
            } else {
              const chapitreId = results[0].chapitreId;
              // Get articleId from Articles table where designation matches
              connection.query(
                "SELECT articleId FROM Articles WHERE designation = ?",
                [updatedBonData.designation],
                (error, results) => {
                  if (error) {
                    connection.rollback(() => {
                      reject(error);
                    });
                  } else {
                    if (results.length === 0) {
                      connection.rollback(() => {
                        reject(new Error("Article not found"));
                      });
                    } else {
                      const articleId = results[0].articleId;
                      // Get fournisseurId from Fournisseurs table where raisonSociale matches
                      connection.query(
                        "SELECT fournisseurId FROM Fournisseurs WHERE raisonSociale = ?",
                        [updatedBonData.raisonSociale],
                        (error, results) => {
                          if (error) {
                            connection.rollback(() => {
                              reject(error);
                            });
                          } else {
                            if (results.length === 0) {
                              connection.rollback(() => {
                                reject(new Error("Fournisseur not found"));
                              });
                            } else {
                              const fournisseurId = results[0].fournisseurId;
                              // Update Bon entity with updated foreign key values
                              connection.query(
                                "UPDATE Bon SET chapitreId = ?, articleId = ?, fournisseurId = ? WHERE bonId = ?",
                                [chapitreId, articleId, fournisseurId, bonId],
                                (error, results) => {
                                  if (error) {
                                    connection.rollback(() => {
                                      reject(error);
                                    });
                                  } else {
                                    // Update Commande entities with updated pu and quantity
                                    const commandsToUpdate =
                                      updatedCommandesData.map((commande) => {
                                        return new Promise(
                                          (resolve, reject) => {
                                            connection.query(
                                              "UPDATE Commande SET pu = ?, quantity = ? WHERE commandeId = ?",
                                              [
                                                commande.pu,
                                                commande.quantity,
                                                commande.commandeId,
                                              ],
                                              (error, results) => {
                                                if (error) {
                                                  reject(error);
                                                } else {
                                                  resolve();
                                                }
                                              }
                                            );
                                          }
                                        );
                                      });
                                    // Execute all update queries
                                    Promise.all(commandsToUpdate)
                                      .then(() => {
                                        connection.commit((err) => {
                                          if (err) {
                                            connection.rollback(() => {
                                              reject(err);
                                            });
                                          } else {
                                            resolve(results);
                                          }
                                        });
                                      })
                                      .catch((error) => {
                                        connection.rollback(() => {
                                          reject(error);
                                        });
                                      });
                                  }
                                }
                              );
                            }
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        }
      );
    });
  });
};

// Function to create a new chapitre
export const createChapitre = (libelle, numChapitre) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO chapitres (libelle,numChapitre) VALUES (?, ?)",
      [libelle, numChapitre],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId); // Resolve with the ID of the newly created chapitre
        }
      }
    );
  });
};
//UPDATE CHAPITRE
export const updateChapitre = (chapitreId, libelle, numChapitre) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE Chapitres SET libelle = ?, numChapitre = ? WHERE chapitreId = ?",
      [libelle, numChapitre, chapitreId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results); // Resolve with the results of the update
        }
      }
    );
  });
};
//DELETE CHAPITRE
export const deleteChapitre = (selectedId) => {
  return new Promise((resolve, reject) => {
    selectedId.map((id) => {
      connection.query(
        "DELETE FROM Chapitres WHERE chapitreId = ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

//UPDATE Article
export const updateArticle = (articleId, designation, code) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE Articles SET designation = ?, code = ? WHERE articleId = ?",
      [designation, code, articleId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId); // Resolve with the results of the update
        }
      }
    );
  });
};

// Function to create a new chapitre
export const createArticle = (chapitreId, designation, code) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO Articles (chapitreId,designation,code) VALUES (?, ?,?)",
      [chapitreId, designation, code],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId); // Resolve with the ID of the newly created chapitre
        }
      }
    );
  });
};

export const deleteArticle = (selectedId) => {
  return new Promise((resolve, reject) => {
    selectedId.map((id) => {
      connection.query(
        "DELETE FROM Articles WHERE articleId = ?",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  });
};

// Function to add a new product
export const addProduct = (newProduct) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO Products SET ?",
      newProduct,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          const insertedId = result.insertId;
          const addedProduct = { ...newProduct, productId: insertedId };
          resolve(addedProduct);
        }
      }
    );
  });
};

// Function to update an existing product
export const updateProduct = (productId, updatedProductData) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE Products SET ? WHERE productId = ?",
      [updatedProductData, productId],
      (error) => {
        if (error) {
          reject(error);
        } else {
          const updatedProduct = { ...updatedProductData, productId };
          resolve(updatedProduct);
        }
      }
    );
  });
};

// Function to delete a product
export const deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "DELETE FROM Products WHERE productId = ?",
      productId,
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};
export default {
  fetchChapitres,
  fetchArticlesByChapitre,
  fetchFournisseursByArticle,
  fetchProductsByArticle,
  createBon,
  updateBon,
  createCommandeRows,
  fetchBonsWithDetails,
  deleteBons,
  fetchCommandesByBon,
  createChapitre,
  updateChapitre,
  deleteChapitre,
  updateArticle,
  createArticle,
  deleteArticle,
  deleteProduct,
  updateProduct,
  addProduct,
};
