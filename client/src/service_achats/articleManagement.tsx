import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

type Chapitre = {
  chapitreId: number;
  numChapitre: string;
  libelle: string;
};

type Article = {
  articleId: number;
  designation: string;
  code:string;
};

type Props = {};

const ArticleManagement: React.FC<Props> = () => {
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [selectedChapitre, setSelectedChapitre] = useState<number | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedArticle, setEditedArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState<Article>({
    articleId: 0,
    designation: '',
    code:'',
   
  });
  useEffect(() => {
    // Fetch chapitres from the server
    fetch('/api/chapitres')
      .then(response => response.json())
      .then(data => setChapitres(data))
      .catch(error => console.error('Error fetching chapitres:', error));
  }, []);

  useEffect(() => {
    // Fetch articles for the selected chapitre
    if (selectedChapitre !== null) {
      fetch(`/api/articles/${selectedChapitre}`)
        .then(response => response.json())
        .then(data => setArticles(data.map((article: Article, index: number) => ({ ...article, id: article.articleId }))))
        .catch(error => console.error('Error fetching articles:', error));
    }
  }, [selectedChapitre]);

  const columns: GridColDef[] = [
    { field: 'articleId', headerName: 'ID', width: 70 },
    { field: 'designation', headerName: 'Designation', width: 450 },
    { field: 'code', headerName: 'Code', width: 200 }
  ];

  const handleChapitreSelection = (chapitreId: number) => {
    setSelectedChapitre(chapitreId);
  };

  const handleAddArticle = () => {
    setEditedArticle(null);

   selectedChapitre? setOpenDialog(true) : alert("Please select a chapitre first");
  };

  const handleSelectionChange = (newSelection: GridRowId[]) => {
    setSelectedRows(newSelection);
  };

  const getSelectedArticle = () => {
    if (selectedRows.length === 1) {
      return articles.find(article => article.articleId === selectedRows[0]) || null;
    }
    return null;
  };
  const handleEditArticle= () => {
    const selectedArticle = getSelectedArticle();
    if (selectedArticle) {
      setEditedArticle(selectedArticle);
      setNewArticle(selectedArticle);
      setOpenDialog(true);
    }else{
      alert("Please select just one article ");
    }
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = async () => {
    try {
      if (editedArticle) {
        // If editing an existing chapitre
        await axios.put('/api/editArticle', {

          articleId: editedArticle.articleId,
          designation: editedArticle.designation,
          code: editedArticle.code,
          
        });
        const updatedArticles = articles.map(article =>
          article.articleId === editedArticle.articleId ? editedArticle : article
        );
        setArticles(updatedArticles);
      } else {
        // If creating a new chapitre
        const response = await axios.post('/api/createArticle', {
          chapitreId:selectedChapitre,
          designation: newArticle.designation,
          code : newArticle.code,
        });
        const newArticleeWithId = {
         ...newArticle,
          articleId: response.data.articleId,
          id:response.data.articleId
        };
    
        setArticles([...articles, newArticleeWithId]);
      }
      // Reset state and close dialog
      setOpenDialog(false);
      setEditedArticle(null);
      setNewArticle({
        articleId: 0,
        designation: '',
        code:'',
      });
    } catch (error) {
      console.error('Error submitting Article:', error);
      // Handle error as needed
    }
  };

  const handleDeleteArticle= async () => {
    const updatedArticles = articles.filter(article => !selectedRows.includes(article.articleId));
    
    try {
      const response = await axios.put('/api/deleteArticle', { selectedId: selectedRows });
      console.log(response.data.message);
      // Handle success message as needed
    } catch (error) {
      console.error('Error deleting chapitre:', error);
      // Handle error as needed
    }
    setSelectedRows([]);
    setArticles(updatedArticles);
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewArticle(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedArticle(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Article Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chapitres.map(chapitre => (
          <div key={chapitre.chapitreId} className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{chapitre.numChapitre}</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleChapitreSelection(chapitre.chapitreId)}
            >
              View Articles
            </button>
          </div>
        ))}
      </div>
      {selectedChapitre !== null && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Articles</h2>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid rows={articles} columns={columns}  getRowId={(row) => row.articleId}  onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedRows}  checkboxSelection />
            </div>
          </div>
        </div>
      )}
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab color="success" aria-label="add" onClick={handleAddArticle} >
          <AddIcon />
        </Fab>
        <Fab color="secondary" aria-label="edit" onClick={handleEditArticle} >
          <EditIcon />
        </Fab>
        <Fab color="error" aria-label="delete" onClick={handleDeleteArticle}>
          <DeleteIcon />
        </Fab>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editedArticle ? 'Edit Article' : 'Add Article'}</DialogTitle>
        <DialogContent>
        <TextField
  autoFocus
  margin="dense"
  label="Designation"
  type="text"
  name="designation"
  value={editedArticle ? editedArticle.designation : newArticle.designation}
  onChange={editedArticle ?handleEditChange:handleAddChange}
  fullWidth
/>
<TextField
  autoFocus
  margin="dense"
  label="Code"
  type="text"
  name="code"
  value={editedArticle ? editedArticle.code : newArticle.code}
  onChange={editedArticle ?handleEditChange:handleAddChange}
  fullWidth
/>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDialogSubmit} color="primary">
            {editedArticle ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ArticleManagement;
