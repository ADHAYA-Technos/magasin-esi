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
export const fetchArticlesByChapitre = (chapitreIdOrNumChapitre, callback) => {
  connection.query(
    "SELECT A.articleId, A.designation, A.code,ROUND(A.TVA * 100, 2)  AS TVA FROM Articles A JOIN Chapitres C ON A.chapitreId = C.chapitreId WHERE A.chapitreId = ? OR C.numChapitre = ?",
    [chapitreIdOrNumChapitre, chapitreIdOrNumChapitre],
    (error, results) => {
      if (!error) {
        callback(null, results);
        console.log(results);
      } else {
        callback(error);
      }
    }
  );
};
export const fetchFournisseurs = (callback) => {
  connection.query(
    "SELECT * FROM Fournisseurs",

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
    "SELECT p.productId ,p.designation,p.quantityPhysique , p.quantityLogique FROM Products p join articles_products ap on p.productId = ap.productId where ap.articleId = ?",
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
      "INSERT INTO Bon (type, chapitreId, articleId, fournisseurId,dateCreation) VALUES (?, ?, ?, ?,?)",
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
    SELECT 
    b.bonId, 
    c.numChapitre, 
    a.designation, 
    b.dateCreation, 
    f.raisonSociale,
    SUM(co.pu * co.quantity) AS totalPu,
    FORMAT(SUM(co.pu * co.quantity) + (SUM(co.pu * co.quantity) * a.TVA), 2) AS total,
    IF(SUM(co.quantity) > 0, SUM(co.deliveredQuantity) / SUM(co.quantity), 0) AS recieved
FROM 
    Bon b
JOIN 
    Chapitres c ON b.chapitreId = c.chapitreId
JOIN 
    Articles a ON b.articleId = a.articleId
JOIN 
    Fournisseurs f ON b.fournisseurId = f.fournisseurId
LEFT JOIN 
    Commande co ON b.bonId = co.bonId
GROUP BY 
    b.bonId;
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
                              console.log(fournisseurId);
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
export const updateArticle = (articleId, designation, code, TVA) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE Articles SET designation = ?, code = ? ,TVA=? WHERE articleId = ?",
      [designation, code, TVA, articleId],
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
export const createArticle = (chapitreId, designation, code, TVA) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO Articles (chapitreId,designation,code,TVA) VALUES (?, ?,?,?)",
      [chapitreId, designation, code, TVA],
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
export const addProduct = (articleId, designation, seuilMin) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO Products (articleId,designation,seuilMin) values (?,?,?)",
      [articleId, designation, seuilMin],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.insertId); // Resolve with the ID of the newly created chapitre
        }
      }
    );
  });
};

// Function to update an existing product
export const updateProduct = (productId, designation, seuilMin) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE Products SET designation = ? , seuilMin = ? WHERE productId = ?",
      [designation, seuilMin, productId],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result); // Resolve with the ID of the newly created chapitre
        }
      }
    );
  });
};

// Function to delete a product
export const deleteProduct = (selectedId) => {
  return new Promise((resolve, reject) => {
    selectedId.map((id) => {
      connection.query(
        "DELETE FROM products WHERE productId = ?",
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

// Function to Associate a products
export const associateProduct = (selectedId, selectedArticle) => {
  return new Promise((resolve, reject) => {
    const queries = selectedId.map((id) => {
      return new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO articles_products (articleId, productId) VALUES (?, ?)",
          [selectedArticle, id],
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

    Promise.all(queries)
      .then((results) => resolve(results))
      .catch((error) => reject(error));
  });
};

// fetchProducts function in yourModule.js
export const fetchProducts = (callback) => {
  connection.query("SELECT * FROM Products ", (error, results) => {
    if (!error) {
      callback(null, results); // Send the results back as the response
    } else {
      callback(error); // Send the error back if there's any
    }
  });
};

// Function to create a new bon
export const createBonRec = (bonId, dateCreation) => {
  return new Promise((resolve, reject) => {
    console.log(dateCreation);
    connection.query(
      "INSERT INTO BonReception (bonId,dateCreation) VALUES (?,?)",
      [bonId, dateCreation],
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

export const createReceptionRows = (bonRecId, updatedCommandes) => {
  if (!Array.isArray(updatedCommandes) || updatedCommandes.length === 0) {
    return Promise.reject("Products array is empty or not an array");
  }

  // Create an array of promises for each update query
  const updatePromises = updatedCommandes.map((updatedCommande) => {
    const { commandeId, quantity, left } = updatedCommande;
    const ligneReceptionQuery =
      "INSERT INTO LigneReception (bonRecId, commandeId, quantity) VALUES (?, ?, ?)";
    const ligneReceptionValues = [bonRecId, commandeId, quantity];

    // Execute the queries sequentially
    return new Promise((resolve, reject) => {
      connection.query(
        ligneReceptionQuery,
        ligneReceptionValues,
        (error, ligneReceptionResults) => {
          if (error) {
            reject(error);
          } else {
            resolve(ligneReceptionValues);
          }
        }
      );
    });
  });

  // Execute all update queries concurrently
  return Promise.all(updatePromises);
};

export const fetchBonRec = (bonId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM bonreception WHERE bonId = ?",
      [bonId],
      (error, results) => {
        if (!error) {
          resolve(results); // Resolve with the results
        } else {
          reject(error); // Reject with the error
        }
      }
    );
  });
};

export const deleteBonRec = (bonIds) => {
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
            "DELETE FROM ligneReception WHERE bonRecId IN (?)",
            [bonIds],
            (error, results) => {
              if (error) {
                connection.rollback(() => {
                  reject(error);
                });
              } else {
                // If commands are deleted successfully, proceed to delete Bons
                connection.query(
                  "DELETE FROM BonReception WHERE BonRecId IN (?)",
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

export const fetchReceptionsByBonRec = (id, callback) => {
  connection.query(
    `SELECT rec.ligneRecId, p.designation, rec.quantity, co.commandeId, co.leftQuantity,co.quantity as demandedQuantity
    FROM Commande co
    JOIN Products p ON co.productId = p.productId
    Join LigneReception rec ON rec.commandeId = co.commandeId
    WHERE rec.BonRecId = ?`,
    [id],
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};

export const updateBonRec = (bonRecId, dateCreation) => {
  return new Promise((resolve, reject) => {
    console.log(dateCreation);
    connection.query(
      "UPDATE BonReception SET dateCreation = ? where bonRecId = ?",
      [dateCreation, bonRecId],
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

export const updateReceptionRows = (bonRecId, updatedCommandes) => {
  if (!Array.isArray(updatedCommandes) || updatedCommandes.length === 0) {
    return Promise.reject("Products array is empty or not an array");
  }

  // Create an array of promises for each update query
  const updatePromises = updatedCommandes.map((updatedCommande) => {
    const { commandeId, quantity } = updatedCommande;
    const ligneReceptionQuery =
      "UPDATE LigneReception set  quantity = ? WHERE bonRecId = ? AND commandeId = ?";
    const ligneReceptionValues = [quantity, bonRecId, commandeId];

    // Execute the queries sequentially
    return new Promise((resolve, reject) => {
      connection.query(
        ligneReceptionQuery,
        ligneReceptionValues,
        (error, ligneReceptionResults) => {
          if (error) {
            reject(error);
          } else {
            console.log(ligneReceptionValues);
            resolve(ligneReceptionValues);
          }
        }
      );
    });
  });
};

export const fetchBCIsWithDetails = (callback) => {
  connection.query(
    `
    SELECT 
    bci.bciId,
    bci.dateCreation,
    bci.typee,
    bci.isSeenByRSR,
    bci.isSeenByDR,
    bci.userId,
    users.name AS name,
    users.service AS service,
    bci.isSeenByMag
FROM  
    bci 
JOIN 
    users  ON bci.userId = users.userId;  `,
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};

export const createBCI = (userId, type, dateCreation) => {
  return new Promise((resolve, reject) => {
    console.log(dateCreation);
    connection.query(
      "INSERT INTO bci (typee, dateCreation, userId, isSeenByRSR, isSeenByMag, isSeenByDR) VALUES (?, ?, ?, ?, ?, ?)",
      [type, dateCreation, userId, 0, 0, 0],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const bciId = results.insertId; // Get the ID of the newly created bon
          // Insert notification for the newly created BCI
          const message = 'Your BCI has been created and is awaiting validation.';
          connection.query(
            "INSERT INTO notifications (bciId, userId, message) VALUES (?, ?, ?)",
            [bciId, userId, message],
            (notifError, notifResults) => {
              if (notifError) {
                reject(notifError);
              } else {
                resolve(bciId); // Resolve with the ID of the newly created bon
              }
            }
          );
        }
      }
    );
  });
};

//create BCI Rows
export const createBciRows = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return Promise.reject("Products array is empty or not an array");
  }

  const values = products.map((product) => [
    product.bonId,
    product.productId,
    product.quantity,
  ]);
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO lignebci (bciId, productId, quantity) VALUES ?",
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

export const fetchLigneBCIByBonRec = (id, callback) => {
  connection.query(
    `SELECT  p.productId , p.designation, lignebci.quantity as demandedQuantity ,lignebci.validated as validated, p.quantityPhysique , p.seuilMin
    FROM lignebci 
    JOIN Products p ON lignebci.productId = p.productId
    WHERE lignebci.bciId = ?`,
    [id],
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};

export const deleteBCIs = (bciId) => {
  return new Promise((resolve, reject) => {
    if (!bciId) {
      console.log("NO BCIs are selected");
      resolve();
    } else {
      connection.beginTransaction((error) => {
        if (error) {
          reject(error);
        } else {
          // Delete related commands first
          connection.query(
            "DELETE FROM lignebci WHERE bciId = ?",
            [bciId],
            (error, results) => {
              if (error) {
                connection.rollback(() => {
                  reject(error);
                });
              } else {
                // If commands are deleted successfully, proceed to delete Bons
                connection.query(
                  "DELETE FROM bci WHERE bciId IN (?)",
                  [bciId],
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

export const updateBCI = (bciId, user) => {
  return new Promise((resolve, reject) => {
    // Determine the update query and message based on the user
    let updateQuery;
    let message;
    if (user === "RSR") {
      updateQuery = "UPDATE bci SET isSeenByRSR = ? WHERE bciId = ?";
      message = "Your BCI has been validated by RSR.";
    } else if (user === "MAG") {
      updateQuery = "UPDATE bci SET isSeenByMag = ? WHERE bciId = ?";
      message = "Your BCI is ready for collection.";
    } else if (user === "Director") {
      updateQuery = "UPDATE bci SET isSeenByDR = ? WHERE bciId = ?";
      message = "Your BCI has been validated by the Director.";
    } else {
      reject(new Error("Invalid user role"));
      return;
    }

    // Execute the update query
    connection.query(updateQuery, [1, bciId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        // Get the userId of the user who created the BCI
        connection.query("SELECT userId FROM bci WHERE bciId = ?", [bciId], (userError, userResults) => {
          if (userError) {
            reject(userError);
          } else {
            const userId = userResults[0].userId;

            // Insert the notification
            connection.query(
              "INSERT INTO notifications (bciId, userId, message) VALUES (?, ?, ?)",
              [bciId, userId, message],
              (notifError, notifResults) => {
                if (notifError) {
                  reject(notifError);
                } else {
                  resolve(results);
                }
              }
            );
          }
        });
      }
    });
  });
};


export const updateBCIRows = (bciId, updatedCommandes) => {
  if (!Array.isArray(updatedCommandes) || updatedCommandes.length === 0) {
    return Promise.reject("Products array is empty or not an array");
  }

  // Create an array of promises for each update query
  const updatePromises = updatedCommandes.map((updatedCommande) => {
    const { productId, demandedQuantity } = updatedCommande;
    const ligneBCIQuery =
      "UPDATE lignebci set  quantity = ? WHERE bciId = ? AND productId = ?";
    const ligneBCIValues = [demandedQuantity, bciId, productId];

    // Execute the queries sequentially
    return new Promise((resolve, reject) => {
      connection.query(
        ligneBCIQuery,
        ligneBCIValues,
        (error, ligneBCIResults) => {
          if (error) {
            reject(error);
          } else {
            console.log(ligneBCIValues);
            resolve(ligneBCIValues);
          }
        }
      );
    });
  });
};
export const updateBCIRRows = (bciId, updatedCommandes) => {
  if (!Array.isArray(updatedCommandes) || updatedCommandes.length === 0) {
    return Promise.reject("Products array is empty or not an array");
  }

  // Create an array of promises for each update query
  const updatePromises = updatedCommandes.map((updatedCommande) => {
    const { productId, demandedQuantity } = updatedCommande;
    const ligneBCIQuery =
      "UPDATE lignebci set  validated = ? WHERE bciId = ? AND productId = ?";
    const ligneBCIValues = [demandedQuantity, bciId, productId];

    // Execute the queries sequentially
    return new Promise((resolve, reject) => {
      connection.query(
        ligneBCIQuery,
        ligneBCIValues,
        (error, ligneBCIResults) => {
          if (error) {
            reject(error);
          } else {
            console.log(ligneBCIValues);
            resolve(ligneBCIValues);
          }
        }
      );
    });
  });
};
export const fetchNotifications = (userId) => {
  
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id, users.name, message 
       FROM notifications 
       JOIN users ON users.userId = notifications.userId 
       WHERE notifications.userId = ? 
       ORDER BY notifications.createdAt DESC`,
      [userId],
      (error, results) => {
        if (!error) {
          resolve(results); // Resolve with the results
        } else {
          reject(error); // Reject with the error
        }
      }
    );
  });
}


export const fetchMontantTotal = (callback) => {
  connection.query(
    `
    SELECT 
      YEAR(b.dateCreation) as year, 
      SUM(co.pu * co.quantity) AS totalPu
    FROM 
      Bon b
    LEFT JOIN 
      Commande co ON b.bonId = co.bonId
    WHERE 
      YEAR(b.dateCreation) BETWEEN 2018 AND 2024
    GROUP BY 
      YEAR(b.dateCreation)
    ORDER BY 
      YEAR(b.dateCreation);
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

export const getTopServices = (callback) => {
  connection.query(
    `
    
    SELECT u.service, COUNT(l.ligneBciId) AS totalLigneBci
        FROM Users u
        JOIN BCI b ON u.userId = b.userId
        JOIN lignebci l ON b.bciId = l.bciId
        GROUP BY u.service
        ORDER BY totalLigneBci DESC
        LIMIT 5;
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

export const getTopRequestedProducts = (callback) => {
  connection.query(
    `
    SELECT p.designation, SUM(l.quantity) AS totalQuantity
    FROM Products p
    JOIN lignebci l ON p.productId = l.productId
    GROUP BY p.designation
    ORDER BY totalQuantity DESC
    LIMIT 5;
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

export const getDistinctServices = (callback) => {
  connection.query(
    `SELECT DISTINCT service FROM Users WHERE service IS NOT NULL;`,
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};

export const getMostConsumedProductInPeriod = (service, startDate, endDate, callback) => {
  connection.query(
    `
    SELECT p.designation, SUM(l.quantity) AS totalQuantity
    FROM Products p
    JOIN lignebci l ON p.productId = l.productId
    JOIN BCI b ON l.bciId = b.bciId
    JOIN Users u ON b.userId = u.userId
    WHERE u.service = ? AND b.dateCreation BETWEEN ? AND ?
    GROUP BY p.designation
    ORDER BY totalQuantity DESC
    LIMIT 5;
    `,
    [service, startDate, endDate],
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        console.log(error)
        callback(error);
      }
    }
  );
};

export const getConsommateurWithMostBCIs = (service, callback) => {
  connection.query(
    `
    SELECT u.name, COUNT(b.bciId) AS totalBCIs
    FROM Users u
    JOIN BCI b ON u.userId = b.userId
    WHERE u.service = ?
    GROUP BY u.name
    ORDER BY totalBCIs DESC
    LIMIT 5;
    `,
    [service],
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};

export const getProductsByArticle = (articleId, callback) => {
  connection.query(
    `
    SELECT p.productId, p.designation, p.quantityLogique, p.isConsommable
    FROM Product p
    WHERE p.articleId = ?;
    `,
    [articleId],
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};

export const updateInventory = (products, callback) => {
  const queries = products.map((product) => {
      // Validate quantityPhysique before generating the query
    
      return ` UPDATE Products SET quantityLogique = ${product.quantityPhysique}  WHERE productId = ${product.productId};`;
  });

  const executeQueries = (index = 0) => {
      if (index < queries.length) {
          connection.query(queries[index], (error, results) => {
              if (error) {
                  callback(error);
              } else {
                  executeQueries(index + 1);
              }
          });
      } else {
          callback(null, { message: 'All queries executed successfully' });
      }
  };

  executeQueries();
};

export const fetchConsommateurs = (callback) => {
  connection.query(
    "SELECT userId,name FROM Users",
    (error, results) => {
      if (!error) {
        callback(null, results);
      } else {
        callback(error);
      }
    }
  );
};


export default {updateBCIRRows,
  fetchConsommateurs,
  updateInventory,
  getProductsByArticle,
  getDistinctServices ,
  getMostConsumedProductInPeriod,
  getConsommateurWithMostBCIs,
  getTopRequestedProducts,
  getTopServices,
  fetchNotifications,
  updateBCIRows,
  fetchChapitres,
  fetchArticlesByChapitre,
  fetchFournisseurs,
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
  fetchBonRec,
  createReceptionRows,
  deleteBonRec,
  updateReceptionRows,
  createBciRows,
  createBCI,
  fetchLigneBCIByBonRec,
  deleteBCIs,
};
