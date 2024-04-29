import express from "express";
import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import router from './routes/user.js';
import {  getUsers, getUser,createUser,updateUser,deleteUser ,loginUser,fetchRoles,fetchPermissions,fetchFunctions} from "./database.js";
import { fetchChapitres,fetchArticlesByChapitre,fetchFournisseursByArticle, fetchProductsByArticle,createBon,createCommandeRows, fetchBonsWithDetails ,deleteBons, fetchCommandesByBon, updateBon, createChapitre, updateChapitre, deleteChapitre, updateArticle, createArticle, deleteArticle, deleteProduct, updateProduct, addProduct} from "./controllers/capfControllers.js";
const app = express()
const port = 5000

app.use(express.urlencoded({extended: true}));
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.use(express.static("public")) 
app.use(express.json());
import path from 'path';
 

// Routes
router.get('/accounts/users', (req, res) => {
  // Render and send the home page HTML
  res.render('home');
});

router.get('/adduser', (req, res) => {
  // Render and send the add user page HTML
  res.render('add-user');
});

router.get('/edituser/:id', (req, res) => {
  // Render and send the edit user page HTML
  res.render('edit-user');
});
// Routes
router.get('/', (req, res) => {
  // Render and send the home page HTML
  res.render('home');
});

router.get('/adduser', (req, res) => {
  // Render and send the add user page HTML
  res.render('add-user');
});

router.get('/edituser/:id', (req, res) => {
  // Render and send the edit user page HTML
  res.render('edit-user');
});

app.use('/', router);


// Create a nodemailer transporter
/*const transporter = nodemailer.createTransport({
  
  service: 'gmail',
  auth: {
      user: 'email@gmail.com',
      pass: 'password',
  },
});*/

// Handle user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
      // Save the user to the database
      const result = await createUser({ username, email, password });

      if (result === true) {
          // User registered successfully
          res.json({ success: true });
            // Send confirmation email to the user
     /* await transporter.sendMail({
          from: 'yacinmca32000@gmail.com',
          to: email,
          subject: 'ESI-STORE | Registration Confirmation',
          text: 'Thank you for registering. Your registration will be processed by the admin.',
      });*/
      } else if (result === 'duplicate') {
          // User is already registered
          res.json({ success: false, message: 'User already registered.' });
      } else {
          // User registration failed due to an error
          res.status(500).json({ success: false, error: 'An error occurred during registration.' });
      }
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, error: 'An error occurred during registration.' });
  }
});

 //login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const isAdmin = await loginUser(email, password);
    if (isAdmin !== null) {
      res.json({ isAdmin });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
//fetch roles then permissions then functions
app.get('/api', async (req, res) => {
  try {
    const userId = 3; // Replace with the actual user ID
    const userRoles = await fetchRoles(userId);
    const rolesWithPermissions = [];

  
    for (const role of userRoles) {
      const permissions = await fetchPermissions(role.roleId);
      rolesWithPermissions.push({
        roleId: role.roleId,
        role: role.role,
        permissions: permissions
      });
    }

    res.json(rolesWithPermissions);
  } catch (error) {
    console.error("Error fetching user roles and permissions:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch chapitres from server.js
app.get('/api/chapitres', async (req, res) => {
  try {
      fetchChapitres((error, results) => {
          if (!error) {
              res.json(results);
          } else {
              console.error("Error fetching chapitres:", error);
              res.status(500).json({ error: 'Internal server error' });
          }
      });
  } catch (error) {
      console.error("Error fetching chapitres:", error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// fetch articles of the chapitres
app.get('/api/articles/:chapitreId', async (req, res) => {
  try {
      const chapitreId = req.params.chapitreId;
      fetchArticlesByChapitre(chapitreId, (error, results) => {
          if (!error) {
              res.json(results);
          } else {
              console.error("Error fetching articles:", error);
              res.status(500).json({ error: 'Internal server error' });
          }
      });
  } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
//fetch fournisseur of the article
app.get('/api/fournisseurs/:articleId', async (req, res) => {
  try {
      const articleId = req.params.articleId;
      fetchFournisseursByArticle(articleId, (error, results) => {
          if (!error) {
              res.json(results);
          } else {
              console.error("Error fetching fournisseurs:", error);
              res.status(500).json({ error: 'Internal server error' });
          }
      });
  } catch (error) {
      console.error("Error fetching fournisseurs:", error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

//fetch products of the article
app.get('/api/products/:articleId', async (req, res) => {
  try {
      const articleId = req.params.articleId;
      fetchProductsByArticle(articleId, (error, results) => {
          if (!error) {
              res.json(results);
          } else {
              console.error("Error fetching fournisseurs:", error);
              res.status(500).json({ error: 'Internal server error' });
          }
      });
  } catch (error) {
      console.error("Error fetching fournisseurs:", error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/createBon', async (req, res) => {
  
  const { chapitreId, articleId, fournisseurId,type,dateCreation } = req.body;
  console.log(dateCreation);  
  try {
    const bonId = await createBon(chapitreId, articleId, fournisseurId,type,dateCreation);
    res.status(201).json({ bonId });
  } catch (error) {
    console.error('Error creating bon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Route to insert rows into Commande table
app.post('/api/createCommandeRows', async (req, res) => {
  const products = req.body;
  try {
    await createCommandeRows(  products);
    res.status(201).json({ message: 'Commande rows inserted successfully' });
  } catch (error) {
    console.error('Error inserting Commande rows:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/getBons', async (req, res) => {
  try {
    fetchBonsWithDetails((error, bons) => {
      if (!error) {
        res.json(bons);
      } else {
        console.error('Error fetching bons:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error('Error fetching bons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//delete Bons
app.delete('/api/deleteBons', async (req, res) => {
  const {bonIds} = req.body;
  try {

    await deleteBons(bonIds);
    res.sendStatus(204); // No content (successful deletion)
  } catch (error) {
    console.error('Error deleting bons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch commandes
app.get('/api/commandes/:bonId', async (req, res) => {
  const { bonId } = req.params;
  try {
    fetchCommandesByBon(bonId, (error, results) => {
      if (!error) {
        res.json(results);
      } else {
        console.error('Error fetching commandes:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error('Error fetching commandes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/bon/:bonId', async (req, res) => {
  const bonId = req.params.bonId;
  const updatedBonData = req.body.updatedBonData;
  console.log(updatedBonData);
  const updatedCommandesData = req.body.updatedCommandesData; 
  console.log(updatedCommandesData);
  // Adjust this based on how the commandes data is sent from the client
  try {
    await updateBon(bonId, updatedBonData, updatedCommandesData); // Pass updatedCommandesData to the function
    res.status(200).json({ message: 'Bon updated successfully' });
  } catch (error) {
    console.error('Error updating bon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//create new chapitre

app.post('/api/createChapitre', async (req, res) => {
  
  const { libelle,numChapitre } = req.body;
  
  try {
    const chapitre = await createChapitre(libelle, numChapitre);
    res.status(201).json({ chapitre });
  } catch (error) {
    console.error('Error creating chapitre:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/editChapitre', async (req, res) => {
  const chapitreId = req.body.chapitreId;
  const libelle= req.body.libelle;
  const numChapitre= req.body.numChapitre;


  try {
    await updateChapitre(chapitreId, libelle, numChapitre); 
    res.status(200).json({ message: 'Chapitre updated successfully' });
  } catch (error) {
    console.error('Error updating Chapitre:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//deleteChapitres
app.put('/api/deleteChapitre', async (req, res) => {
  const selectedId = req.body.selectedId; // Access data from request body

  try {
    await deleteChapitre(selectedId); 
    res.status(200).json({ message: 'Chapitres deleted successfully' });
  } catch (error) {
    console.error('Error updating Chapitre:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/createArticle', async (req, res) => {
  
  const { chapitreId,designation,code } = req.body;
  
  try {
    const article = await createArticle( chapitreId,designation,code);
    res.status(201).json({ article });
  } catch (error) {
    console.error('Error creating Article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/editArticle', async (req, res) => {
  const articleId = req.body.articleId;
  const designation= req.body.designation;
  const code= req.body.code;


  try {
    await updateArticle(articleId, designation, code); 
    res.status(200).json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating Article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//deleteChapitres
app.put('/api/deleteArticle', async (req, res) => {
  const selectedId = req.body.selectedId; // Access data from request body

  try {
    await deleteArticle(selectedId); 
    res.status(200).json({ message: 'Articles deleted successfully' });
  } catch (error) {
    console.error('Error deleting Article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await addProduct(newProduct);
    res.status(201).json(addedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add endpoint for updating a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;
    const updatedProduct = await updateProduct(productId, updatedProductData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add endpoint for deleting a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await deleteProduct(productId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`)
})