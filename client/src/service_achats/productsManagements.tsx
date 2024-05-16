import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowId, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
type Product = {
  productId: number;
  designation: string;
  seuilMin : number;
  
};

const ProductsManagement: React.FC = () => {
  const [chapitres, setChapitres] = useState<string[]>([]);
  const [selectedChapitre, setSelectedChapitre] = useState("");
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [articleProducts, setArticleProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    productId: 0,
    designation: "",
    seuilMin : 0,
  });
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [selectedAPRows, setSelectedAPRows] = useState<GridRowId[]>([]);
  useEffect(() => {
    fetch("/api/chapitres")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChapitres(data);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Fetch articles based on selectedChapitre from /api/articles/:chapitreId
    if (selectedChapitre) {
      fetch(`/api/articles/${selectedChapitre}`)
        .then((response) => response.json())
        .then((data) => setArticles(data))
        .catch((error) => console.error("Error fetching articles:", error));
    }
  }, [selectedChapitre]);

  useEffect(() => {
    fetch(`/api/products`)
        .then((response) => response.json())
        .then((data) => {
          // Map through the data array and add id as productId to each product
          const productsWithIds = data.map((product) => ({
            ...product,
            id: product.productId, // Assuming productId starts from 1
          }));
          setProducts(productsWithIds);
        })
        .catch((error) => console.error("Error fetching products:", error));
   
    // Fetch products based on selectedArticle from /api/products/:articleId
    if (selectedArticle) {
   
      fetch(`/api/products/${selectedArticle}`)
      .then((response) => response.json())
      .then((data) => {
        // Map through the data array and add id as productId to each product
        const productsWithIds = data.map((product) => ({
          ...product,
          id: product.productId, // Assuming productId starts from 1
        }));
        setArticleProducts(productsWithIds);
      })
      .catch((error) => console.error("Error fetching products:", error));
    }
  }, [selectedArticle]);

  const handleSelectionChange = (newSelection: GridRowId[]) => {
    setSelectedRows(newSelection);
  };

  const handleAPSelectionChange = (newSelection: GridRowId[]) => {
    setSelectedAPRows(newSelection);
  };

  const handleChapitreChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedChapitre(event.target.value as string);
    setSelectedArticle("");
  };

  const handleArticleChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    
    setSelectedArticle(event.target.value as string);
    
  };

  const handleDialogSubmit = async () => {
    try { 
      if (editedProduct){
        console.warn(editedProduct);
        await axios.put('/api/editProduct', {

          productId : editedProduct.productId ,
          designation: editedProduct.designation,
         seuilMin : editedProduct.seuilMin
          
        });
        const updatedProducts = products.map(product =>
          product.productId === editedProduct.productId ? editedProduct : product
        );
        setProducts(updatedProducts);
        setOpenDialog(false);
       
      } else{
        const response = await axios.post('/api/addProduct', {
          articleId: articles.find(article => article.articleId === Number(selectedArticle))?.articleId,
          designation: newProduct.designation,
          seuilMin : newProduct.seuilMin
        });
        const newProductWithId = {
         ...newProduct,
         productId:response.data,
        id: response.data,
        };
        setProducts([...products, newProductWithId]);
      
      }
      setOpenDialog(false);
      setEditedProduct(null);
      setNewProduct({
        productId: 0,
        designation: '',
        seuilMin : 0,
      });
    } catch (error) {
      console.error('Error submitting Product:', error);
      // Handle error as needed
    }
  };

  const handleProductAssociation = async ( ) => {
    const alreadyAssociated = selectedRows.some(productId => 
      articleProducts.some(ap => ap.productId === productId)
    );
    if(alreadyAssociated){
      alert("Product already associated with the article");
      return;
    }else if (selectedRows.length === 0){

      alert("Please select at least one product ");
      return;
    }
    try {

      const response = await axios.put('/api/associateProduct', { selectedId: selectedRows , selectedArticle });
      
      setArticleProducts([...articleProducts, ...products.filter(product => selectedRows.includes(product.productId))]);
    } catch (error) {
      console.error('Error deleting product:', error);
      
      // Handle error as needed
    }
    window.confirm('Product associated successfully to Article ID: ' + selectedArticle)
      
  };
  const handleUpdateProduct = (id: GridRowId) => {
    if(selectedRows.length === 1){
      const selectedProduct = products.find(product => product.productId === selectedRows[0]);
      if(selectedProduct){
        setEditedProduct(selectedProduct);
        setNewProduct(selectedProduct);
        setOpenDialog(true);
      }else{
        alert("Please select one product ");
      }
  }else{
    alert("Please select [just] one product ");
  };
  };
  const handleDeleteProduct = async () => {
    const updatedProducts = products.filter(product => !selectedRows.includes(product.productId));
   
    try {

      const response = await axios.put('/api/deleteProduct', { selectedId: selectedRows });
      
      console.log(response.data.message);
      // Handle success message as needed
    } catch (error) {
      console.error('Error deleting product:', error);
      
      // Handle error as needed
    }
    
    setProducts(updatedProducts);
    setSelectedRows([]);
  };

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 100 },
    { field: "designation", headerName: "Designation", width: 200 },
    { field: "quantity", headerName: "Quantity en stock", width: 250 },
  ];

  


  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'seuilMin' && parseInt(e.target.value)<0 ) {
      e.target.value ='20';
      alert('seuilMin should be greater or equal  0 ')
      return ;
    } 
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'seuilMin' && parseInt(e.target.value)<0 ) {
     
      alert('seuilMin should be greater or equal than 0')
      return ;
    } 
    const { name, value } = e.target;
    setEditedProduct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCloseDialog = () => {
    setNewProduct({
        productId: 0,
        designation: '',
        seuilMin : 0,
      });
    

    setEditedProduct({
      productId: 0,
      designation: '',
      seuilMin : 0,
    });
    setOpenDialog(false);

  };
  return (
    <div>
    <FormControl fullWidth variant="outlined" margin="normal">
      <InputLabel id="chapitre-label">Select a Chapitre</InputLabel>
      <Select
        labelId="chapitre-label"
        value={selectedChapitre}
        onChange={handleChapitreChange}
        label="Select a Chapitre"
      >
        <MenuItem value="">
          <em>-- Select Chapitre --</em>
        </MenuItem>
        {chapitres.map((chapitre) => (
          <MenuItem key={chapitre.chapitreId} value={chapitre.chapitreId}>
            {chapitre.libelle}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  
    {selectedChapitre && (
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="article-label">Select an Article</InputLabel>
        <Select
          labelId="article-label"
          value={selectedArticle}
          onChange={handleArticleChange}
          label="Select an Article"
        >
          <MenuItem value="">
            <em>-- Select Article --</em>
          </MenuItem>
          {articles.map((article) => (
            <MenuItem key={article.articleId} value={article.articleId}>
              {article.designation}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  
    {selectedArticle && (
      <div style={{ height: 400, width: '100%', marginTop: '16px' }}>
        <DataGrid
          rows={articleProducts}
          columns={columns}
          pageSize={5}
          components={{
            Toolbar: GridToolbar,
          }}
          onRowSelectionModelChange={handleAPSelectionChange}
          rowSelectionModel={selectedAPRows}
          checkboxSelection
        />
      </div>
    )}
  
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>{editedProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Chapitre"
          type="text"
          name="chapitre"
          value={
            chapitres.find((chapitre) => chapitre.chapitreId === Number(selectedChapitre))?.libelle || ''
          }
          disabled
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          label="Article"
          type="text"
          name="article"
          value={
            articles.find((article) => article.articleId === Number(selectedArticle))?.designation
          }
          disabled
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          label="Designation"
          type="text"
          name="designation"
          value={editedProduct ? editedProduct.designation : newProduct.designation}
          onChange={editedProduct ? handleEditChange : handleAddChange}
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          label="Seuil Minimum en stock"
          type="number"
          name="seuilMin"
          value={editedProduct ? editedProduct.seuilMin : newProduct.seuilMin}
          onChange={editedProduct ? handleEditChange : handleAddChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleDialogSubmit} color="primary">
          {editedProduct ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  
    <Typography variant="h6" gutterBottom>
      All Products
    </Typography>
    <div style={{ height: 400, width: '100%', marginTop: '16px' }}>
      <DataGrid
        rows={products}
        columns={columns}
        pageSize={5}
        components={{
          Toolbar: GridToolbar,
        }}
        onRowSelectionModelChange={handleSelectionChange}
        rowSelectionModel={selectedRows}
        checkboxSelection
      />
    </div>
  
    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="success"
          onClick={handleProductAssociation}
        >
          Associate Product
        </Button>
      )}
      <Fab color="primary" aria-label="add" onClick={() => setOpenDialog(true)}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="edit" onClick={() => handleUpdateProduct(selectedArticle)}>
        <EditIcon />
      </Fab>
      <Fab color="error" aria-label="delete" onClick={() => handleDeleteProduct(selectedArticle)}>
        <DeleteIcon />
      </Fab>
    </Box>
  </div>
  );
};

export default ProductsManagement;
