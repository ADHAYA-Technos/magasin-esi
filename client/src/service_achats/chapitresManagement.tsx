import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItemButton, ListItemText, MenuList } from '@mui/material';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
  useEffect(() => {
    fetch('/api/chapitres')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const chapitreWithIds = data.map((chapitre: Chapitre, index: number) => ({
            ...chapitre,
            id: chapitre.chapitreId, // Use the index as a simple unique identifier
          }));
          setChapitres(chapitreWithIds);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const columns: GridColDef[] = [
    { field: 'chapitreId', headerName: 'ID', width: 70 },
    { field: 'numChapitre', headerName: 'N° Chapitre', width: 130 },
    { field: 'libelle', headerName: 'Libellée', width: 130 },
  ];

 
  const handleSelectionChange = (newSelection: GridRowId[]) => {
    setSelectedRows(newSelection);
  };

  const handleAddChapitre = () => {
    setEditedChapitre(null);
    setOpenDialog(true);
  };

  const handleEditChapitre = () => {
    if (selectedRows.length === 1) {
      const selectedChapitre = chapitres.find(chapitre => chapitre.id === parseInt(selectedRows[0] as string));
      if (selectedChapitre) {
        setEditedChapitre(selectedChapitre);
        setOpenDialog(true);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = (newChapitre: Chapitre) => {
    // Send the new or updated chapitre to the server
    // Upon successful response, update the chapitres state
    // Close the dialog
  };

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={chapitres}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={handleSelectionChange}
          selectionModel={selectedRows}
        />
      </div>
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab color="success" aria-label="add" onClick={handleAddChapitre}>
          <AddIcon />
        </Fab>
        <Fab color="secondary" aria-label="edit" onClick={handleEditChapitre}>
          <EditIcon />
        </Fab>
        <Fab color="error" aria-label="delete">
          <DeleteIcon />
        </Fab>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editedChapitre ? 'Edit Chapitre' : 'Add Chapitre'}</DialogTitle>
        <DialogContent>
          {/* Form fields for editing or adding a chapitre */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={() => handleDialogSubmit(editedChapitre)}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChapitresManagement;
