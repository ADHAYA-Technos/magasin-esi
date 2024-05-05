import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

type Chapitre = {
  chapitreId: number;
  numChapitre: string;
  libelle: string;
};

type Props = {};

const ChapitresManagement: React.FC<Props> = () => {
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedChapitre, setEditedChapitre] = useState<Chapitre | null>(null);
  const [newChapitre, setNewChapitre] = useState<Chapitre>({
    chapitreId: 0,
    numChapitre: '',
    libelle: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/chapitres');
        const data = await response.json();
        if (Array.isArray(data)) {
          const chapitreWithIds = data.map((chapitre: Chapitre, index: number) => ({
            ...chapitre,
            id: chapitre.chapitreId,
          }));
          setChapitres(chapitreWithIds);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: 'chapitreId', headerName: 'ID', width: 70 },
    { field: 'numChapitre', headerName: 'N° Chapitre', width: 130 },
    { field: 'libelle', headerName: 'Libellée', width:450 },
  ];

  const handleSelectionChange = (newSelection: GridRowId[]) => {
    setSelectedRows(newSelection);
  };

  const handleAddChapitre = () => {
    setEditedChapitre(null);
    setOpenDialog(true);
  };

  const getSelectedChapitre = () => {
    if (selectedRows.length === 1) {
      return chapitres.find(chapitre => chapitre.chapitreId === selectedRows[0]) || null;
    }
    return null;
  };

  const handleEditChapitre = () => {
    const selectedChapitre = getSelectedChapitre();
    if (selectedChapitre) {
      setEditedChapitre(selectedChapitre);
      setNewChapitre(selectedChapitre);
      setOpenDialog(true);
    }else{
      alert("Veuillez sélectionner un et un seul chapitre")
    }
  };

  const handleDeleteChapitre = async () => {
    const updatedChapitres = chapitres.filter(chapitre => !selectedRows.includes(chapitre.id));
    
    try {
      const response = await axios.put('/api/deleteChapitre', { selectedId: selectedRows });
      console.log(response.data.message);
      // Handle success message as needed
    } catch (error) {
      console.error('Error deleting chapitre:', error);
      // Handle error as needed
    }
    setSelectedRows([]);
    setChapitres(updatedChapitres);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = async () => {
    try {
      if (editedChapitre) {
        // If editing an existing chapitre
        await axios.put('/api/editChapitre', {
          chapitreId: editedChapitre.chapitreId,
          libelle: editedChapitre.libelle,
          numChapitre: editedChapitre.numChapitre,
        });
        const updatedChapitres = chapitres.map(chapitre =>
          chapitre.chapitreId === editedChapitre.chapitreId ? editedChapitre : chapitre
        );
        setChapitres(updatedChapitres);
      } else {
        // If creating a new chapitre
        const response = await axios.post('/api/createChapitre', {
          libelle: newChapitre.libelle,
          numChapitre: newChapitre.numChapitre,
        });
        console.log(response);
        const newChapitreWithId = {
          ...newChapitre,
          chapitreId: response.data.chapitre,
          id: response.data.chapitre,
        };
        setChapitres([...chapitres, newChapitreWithId]);
      }
      // Reset state and close dialog
      setOpenDialog(false);
      setEditedChapitre(null);
      setNewChapitre({
        chapitreId: 0,
        numChapitre: '',
        libelle: '',
      });
    } catch (error) {
      console.error('Error submitting chapitre:', error);
      // Handle error as needed
    }
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewChapitre(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedChapitre(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={chapitres}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedRows}
        />
      </div>
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab color="success" aria-label="add" onClick={handleAddChapitre}>
          <AddIcon />
        </Fab>
        <Fab color="secondary" aria-label="edit" onClick={handleEditChapitre}>
          <EditIcon />
        </Fab>
        <Fab color="error" aria-label="delete" onClick={handleDeleteChapitre}>
          <DeleteIcon />
        </Fab>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editedChapitre ? 'Edit Chapitre' : 'Add Chapitre'}</DialogTitle>
        <DialogContent>
        <TextField
  autoFocus
  margin="dense"
  label="N° Chapitre"
  type="text"
  name="numChapitre"
  value={editedChapitre ? editedChapitre.numChapitre : newChapitre.numChapitre}
  onChange={editedChapitre ?handleEditChange:handleAddChange}
  fullWidth
/>
<TextField
  margin="dense"
  label="Libellée"
  type="text"
  name="libelle"
  value={editedChapitre ? editedChapitre.libelle : newChapitre.libelle}
  onChange={editedChapitre ?handleEditChange:handleAddChange}
  fullWidth
/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDialogSubmit} color="primary">
            {editedChapitre ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChapitresManagement;
  