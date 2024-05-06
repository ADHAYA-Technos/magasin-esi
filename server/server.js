import express from "express";
import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import router from './routes/user.js';
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/userRoute.js"
import RoleRoute from "./routes/roleRoute.js"
import Database from "./config/Database.js";
import AuthRoutes from "./routes/authRoutes.js"
import {  getUsers, getUser,createUser,updateUser,deleteUser ,loginUser,fetchRoles,fetchPermissions,fetchFunctions} from "./database.js";
import { fetchChapitres,fetchArticlesByChapitre, fetchProductsByArticle,createBon,createCommandeRows, fetchBonsWithDetails ,deleteBons, fetchCommandesByBon, updateBon, createChapitre, updateChapitre, deleteChapitre, updateArticle, createArticle, deleteArticle, deleteProduct, updateProduct, addProduct, fetchProducts, createBonRec, createReceptionRows, fetchBonRec, fetchFournisseurs, deleteBonRec, fetchReceptionsByBonRec, updateBonRec, updateReceptionRows} from "./controllers/capfControllers.js";
const app = express()
const port = 5000
dotenv.config();

app.use(express.urlencoded({extended: true}));
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.use(express.static("public")) 
app.use(express.json());
(async()=>(
  await Database.sync()
  ))
   ();
app.use(UserRoute);
app.use(AuthRoutes);
app.use(RoleRoute);
import path from 'path';
 
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(session({
  secret:process.env.SESS_SECRET,
  resave : false,
  saveUninitialized :true,
  cookie: {
    secure: 'auto', }
}));

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
app.get('/api/fournisseurs', async (req, res) => {
  try {
      fetchFournisseurs((error, results) => {
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
  console.log(updatedBonData.raisonSociale);
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
    res.status(201).json( article );
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

app.post('/api/addProduct', async (req, res) => {
  const {articleId,designation} = req.body;
  try {
   
    const addedProduct = await addProduct(articleId, designation);
    res.status(201).json(addedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add endpoint for updating a product
app.put('/api/editProduct', async (req, res) => {
  const productId = req.body.productId;
  const designation= req.body.designation;
  
console.log(req.body);
  try {
   
    const updatedProduct = await updateProduct(productId, designation);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add endpoint for deleting a product
app.put('/api/deleteProduct', async (req, res) => {

const selectedId = req.body.selectedId; // Access data from request body
try {
    await deleteProduct(selectedId); 
    res.status(200).json({ message: 'products deleted successfully' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
      fetchProducts((error, results) => {
          if (!error) {
              res.json(results);
          } else {
              console.error("Error fetching products:", error);
              res.status(500).json({ error: 'Internal server error' });
          }
      });
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/bonRec/:bonId', async (req, res) => {
  const bonId = req.params.bonId;
  const updatedCommandes = req.body.updatedCommandes;
  const dateCreation=updatedCommandes[0].dateCreation;


  try {
    const bonRecId =await createBonRec(bonId,dateCreation); // Pass updatedCommandesData to the function
    res.status(200).json({ message: 'Bon Reception created successfully' });
    await createReceptionRows(bonRecId,updatedCommandes); // Pass updatedCommandesData to the function
  } catch (error) {
    console.error('Error updating bon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }


});

app.get('/api/getBonRec/:bonId', async (req, res) => {
  const bonId = req.params.bonId;

  try {
    const bonRec = await fetchBonRec( bonId);
    res.status(200).json(bonRec);
  } catch (error) {
    console.error('Error fetching bon reception:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/deleteBonRec', async (req, res) => {
  const {bonIds} = req.body;
  try {

    await deleteBonRec(bonIds);
    res.sendStatus(204); // No content (successful deletion)
  } catch (error) {
    console.error('Error deleting bons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/receptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    fetchReceptionsByBonRec(id, (error, results) => {
      if (!error) {
        res.json(results);
        console.log(results);
      } else {
        console.error('Error fetching ligne de receptions:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error('Error fetching ligne de receptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/updateBonRec/:id', async (req, res) => {
  const bonRecId = req.params.id;
  const updatedCommandes = req.body.updatedCommandes;
  const dateCreation=updatedCommandes[0].dateCreation;


  try {
    await updateBonRec(bonRecId,dateCreation); // Pass updatedCommandesData to the function
    res.status(200).json({ message: 'Bon Reception created successfully' });
    await updateReceptionRows(bonRecId,updatedCommandes); // Pass updatedCommandesData to the function
  } catch (error) {
    console.error('Error updating bon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }


});
app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`)
})