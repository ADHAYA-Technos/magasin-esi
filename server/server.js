import express from 'express';

import exphbs from 'express-handlebars';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import connectSessionSequelize from 'connect-session-sequelize';
import cookieParser from 'cookie-parser';

import router from './routes/user.js';
import RoleRoute from './routes/roleRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import ensureAuthenticated from './middleware/ensureAuthenticated.js';
import checkCompleted from './middleware/checkCompleted.js';
import passport from './config/passportConfig.js';
import Database from './config/Database.js';
import UserController from './controllers/UserController.js';

import {
  fetchChapitres,
  fetchArticlesByChapitre,
  fetchProductsByArticle,
  createBon,
  createCommandeRows,
  fetchBonsWithDetails,
  deleteBons,
  fetchCommandesByBon,
  updateBon,
  createChapitre,
  updateChapitre,
  deleteChapitre,
  updateArticle,
  createArticle,
  deleteArticle,
  deleteProduct,
  updateProduct,
  addProduct,
  fetchProducts,
  createBonRec,
  createReceptionRows,
  fetchBonRec,
  fetchFournisseurs,
  deleteBonRec,
  fetchReceptionsByBonRec,
  updateBonRec,
  updateReceptionRows,
  fetchBCIsWithDetails,
  createBciRows,
  createBCI,
  fetchLigneBCIByBonRec,
  deleteBCIs,
  updateBCIRows,
  updateBCI,
  associateProduct
} from './controllers/capfControllers.js';

dotenv.config();

const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser('secret'));

const SequelizeStore = connectSessionSequelize(session.Store);
const store = new SequelizeStore({
  db: Database,
});

store.sync();

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const handlebars = exphbs.create({ extname: '.hbs' });
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
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

app.use(adminRoutes);
app.use(RoleRoute);

app.get('/check-authentication', async (req, res) => {
  if (req.isAuthenticated()) {
    let roles = await req.user.getRoles();
    roles = roles.map((role) => role.dataValues.role.toLowerCase());
    res.status(200).send({
      state: true,
      roles,
      type: req.user.dataValues.userType,
      user: req.user,
    });
  } else {
    res.status(401).send({ state: false });
  }
});

app.post('/sign-up', UserController.createUser);
app.get('/verify-email', UserController.verifyUser);
app.post('/login', [passport.authenticate('local')], (req, res) => {
  res.status(200).json(req.user);
});

app.post('/reset-password-request', UserController.requestPasswordReset);
app.post('/reset-password', UserController.resetPassword);
app.post(
  '/complete-profile',
  [ensureAuthenticated, checkCompleted],
  UserController.completeUser
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: 'You have been logged out' });
  });
});


app.use('/', router);



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
  console.log(req.body);
  const TVA =req.body.TVA ;
  try {
    const article = await createArticle( chapitreId,designation,code,TVA);
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
  const TVA =req.body.TVA ;

  try {
    await updateArticle(articleId, designation, code,TVA); 
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
  const {articleId,designation,seuilMin} = req.body;
  try {
   
    const addedProduct = await addProduct(articleId, designation,seuilMin);
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
  const seuilMin= req.body.seuilMin;
console.log(req.body);
  try {
   
    const updatedProduct = await updateProduct(productId, designation,seuilMin);
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

app.put('/api/associateProduct', async (req, res) => {

  const selectedId = req.body.selectedId; 
  const selectedArticle =  req.body.selectedArticle; 
 
  try {
      await associateProduct(selectedId,selectedArticle); 
      res.status(200).json({ message: 'products Associated successfully' });
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
  const updatedCommandes= req.body.updatedCommandes;
  console.log(updatedCommandes);
  const dateCreation=req.body.updatedCommandes[0].dateCreation;


  try {
    await updateBonRec(bonRecId,dateCreation); // Pass updatedCommandesData to the function
    res.status(200).json({ message: 'Bon Reception created successfully' });
    await updateReceptionRows(bonRecId,updatedCommandes); // Pass updatedCommandesData to the function
  } catch (error) {
    console.error('Error updating bon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  

});

app.get('/api/getBCIs', async (req, res) => {
  try {
    fetchBCIsWithDetails((error, bons) => {
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

//Create BCI 
app.post('/api/createBCI', async (req, res) => {
  
  const { userId,type,dateCreation } = req.body;
  
  try {
    const bciId = await createBCI(userId,type,dateCreation);
    res.status(201).json({ bciId });
  } catch (error) {
    console.error('Error creating bon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to insert rows into lignebci table
app.post('/api/createBciRows', async (req, res) => {

  const products = req.body;
  console.log(products);
  try {
    await createBciRows(  products);
    res.status(201).json({ message: 'Commandes of "BCI" rows inserted successfully' });
  } catch (error) {
    console.error('Error inserting Commande rows:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/lignebci/:id', async (req, res) => {
  const { id } = req.params;
  try {
    fetchLigneBCIByBonRec(id, (error, results) => {
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


//delete BCIs
app.delete('/api/deleteBCIs', async (req, res) => {
  console.log(req.body);
  const bciId = req.body.selectedRows;
  try {

    await deleteBCIs(bciId);
    res.sendStatus(204); // No content (successful deletion)
  } catch (error) {
    console.error('Error deleting bons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/updateBCI/:id', async (req, res) => {
  const bciId = req.params.id;
  const updatedCommandes= req.body.updatedCommandes;
  console.log(updatedCommandes);
  const dateCreation=req.body.updatedCommandes[0].dateCreation;
  if(updatedCommandes[0].MAG ){
    try {
      await updateBCI(bciId,updatedCommandes[0].MAG); // Pass updatedCommandesData to the function
      res.status(200).json({ message: 'Bon de Commande Interne Validated per Magasinier successfully' });
      await updateBCIRows(bciId,updatedCommandes); // Pass updatedCommandesData to the function
    } catch (error) {
      console.error('Error updating BCI:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }else
  if(updatedCommandes[0].RSR ){
    try {
      await updateBCI(bciId,updatedCommandes[0].RSR); // Pass updatedCommandesData to the function
      res.status(200).json({ message: 'Bon de Commande Interne Validated per RSR successfully' });
      await updateBCIRows(bciId,updatedCommandes); // Pass updatedCommandesData to the function
    } catch (error) {
      console.error('Error updating BCI:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }else if (updatedCommandes[0].DR){
    
    try {
      await updateBCI(bciId,updatedCommandes[0].DR); // Pass updatedCommandesData to the function
      res.status(200).json({ message: 'Bon de Commande Interne Validated per Director successfully' });
      await updateBCIRows(bciId,updatedCommandes); // Pass updatedCommandesData to the function
    } catch (error) {
      console.error('Error updating BCI:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return ;
  }

  try {
    await updateBCI(bciId,dateCreation); // Pass updatedCommandesData to the function
    res.status(200).json({ message: 'Bon de Commande Interne created successfully' });
    await updateBCIRows(bciId,updatedCommandes); // Pass updatedCommandesData to the function
  } catch (error) {
    console.error('Error updating BCI:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  

});
app.listen(port, () => {
  console.log(`Example app listening on ports ${port}`)
})