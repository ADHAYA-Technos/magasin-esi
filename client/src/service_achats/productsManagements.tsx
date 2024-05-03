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
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
type Product = {
  productId: number;
  designation: string;
};

const ProductsManagement: React.FC = () => {
  const [chapitres, setChapitres] = useState<string[]>([]);
  const [selectedChapitre, setSelectedChapitre] = useState("");
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    productId: 0,
    designation: "",
  });
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

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
          setProducts(productsWithIds);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [selectedArticle]);

  const handleSelectionChange = (newSelection: GridRowId[]) => {
    setSelectedRows(newSelection);
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

  const handleAddProduct = () => {};

  const handleUpdateProduct = (id: GridRowId) => {};

  const handleDeleteProduct = (id: GridRowId) => {};

  const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 100 },
    { field: "designation", headerName: "Designation", width: 200 },
    { field: "quantity", headerName: "Quantity en stock", width: 250 },
  ];

  return (
    <div>
      <label>Select a chapitre:</label>
      <select value={selectedChapitre} onChange={handleChapitreChange}>
        <option value="">-- Select Chapitre --</option>
        {chapitres.map((chapitre: any) => (
          <option key={chapitre.chapitreId} value={chapitre.chapitreId}>
            {chapitre.libelle}
          </option>
        ))}
      </select>

      {selectedChapitre && (
        <>
          <label>Select an article:</label>
          <select value={selectedArticle} onChange={handleArticleChange}>
            <option value="">-- Select Article --</option>
            {articles.map((article: any) => (
              <option key={article.articleId} value={article.articleId}>
                {article.designation}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedArticle && (
        <div style={{ height: 400, width: "100%" }}>
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
      )}

      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>
        <Fab
          color="secondary"
          aria-label="edit"
          onClick={() => handleUpdateProduct(selectedArticle)}
        >
          <EditIcon />
        </Fab>
        <Fab
          color="error"
          aria-label="delete"
          onClick={() => handleDeleteProduct(selectedArticle)}
        >
          <DeleteIcon />
        </Fab>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editedProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chapitre"
            type="text"
            name="chapitre"
            value={
              chapitres.find(
                (chapitre) => chapitre.chapitreId === Number(selectedChapitre)
              )?.libelle || ""
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
              articles.find(
                (article) => article.articleId === Number(selectedArticle)
              )?.designation
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
            value={newProduct.designation}
            onChange={(e) =>
              setNewProduct({ ...newProduct, designation: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} color="primary">
            {editedProduct ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsManagement;
