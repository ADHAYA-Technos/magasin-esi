import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridRowId, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import NavigationIcon from '@mui/icons-material/Navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBCE from './Forms/AddBCE.tsx';
import EditBCE from './Forms/EditBCE.tsx';
import { renderProgress } from '../render/renderProgress.tsx';
import saveAs from 'file-saver';
import Papa from 'papaparse';
interface Bon {
  id: number;
  numChapitre: string;
  articleName: string;
  creationDate: string;
  fournisseur: string;
  recieved: number;
  prix: string;
}

const BceManagement: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [bons, setBons] = useState<Bon[]>([]);
  const [showAddBCE, setShowAddBCE] = useState<boolean>(false);
  const [showEditBCE, setShowEditBCE] = useState<boolean>(false);
  const [selectedRowForEdit, setSelectedRowForEdit] = useState<Bon | null>(null);
  useEffect(() => {
    fetchBons();
  }, []);

  const fetchBons = async () => {
    try {
      const response = await axios.get('/api/getBons');
      // Add a unique identifier to each row object
      const bonsWithIds = response.data.map((bon, index) => ({
        ...bon,
        id: bon.bonId, // Use the index as a simple unique identifier
      }));
      setBons(bonsWithIds);
    } catch (error) {
      console.error('Error fetching bons:', error);
    }
  };
  

  const columns: GridColDef[] = [
    { field: 'bonId', headerName: 'ID', width: 70 }, // Change field to 'id'
    { field: 'numChapitre', headerName: 'N° Chapitre', width: 130 },
    { field: 'designation', headerName: 'Article', width: 250 }, // Change field to 'articleName'
    { field: 'dateCreation', headerName: 'Date De Création', width: 130 }, // Change field to 'creationDate'
    { field: 'raisonSociale', headerName: 'Fournisseur', width: 130 }, // Change field to 'fournisseur'
    { field: 'recieved', headerName: 'Recieved', type: 'number', renderCell: renderProgress, width: 80 },
    { field: 'totalPu', headerName: 'Prix', width: 130 }, // Change field to 'prix'
  ];
  
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
<GridToolbarExport onClick={exportToCSV} />
      </GridToolbarContainer>
    );
  }

  const exportToCSV = () => {
    // Create the CSV string manually with proper encoding
    let csvContent = "data:text/csv;charset=utf-8,";
  
    // Add header row
    csvContent += "ID,N° Chapitre,Article,Date De Création,Fournisseur,Recieved,Prix\n";
  
    // Add data rows
    bons.forEach(bon => {
      csvContent += `${bon.id},${bon.numChapitre},${bon.articleName},${bon.creationDate},${bon.fournisseur},${bon.recieved},${bon.prix}\n`;
    });
  
    // Create a blob and initiate download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bons.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };
  const handleSelectionChange = (newSelection: GridRowId[]) => {
  
    setSelectedRows(newSelection); 
  };

  const handleAddBCE = () => {
    setShowAddBCE(true);
  };

  const handleGoBack = () => {
    setShowEditBCE(false);
    setShowAddBCE(false);
  };
  const handleDeleteBons = async () => {
    const bonsToDelete = bons.filter(bon => selectedRows.includes(bon.id));
   
    const bonsWithRecieved = bonsToDelete.filter(bon => bon.recieved > 0);
    if (bonsWithRecieved.length > 0) {
      const bonIds = bonsWithRecieved.map(bon => bon.id).join(', ');
      window.alert(`Bon ID: ${bonIds} has already started receiving orders. You cannot delete it.`);
      return; // Exit the function without further execution
    }
  
    try {
      await axios.delete('/api/deleteBons', {
        data: { bonIds: bonsToDelete.map(bon => bon.id) }
      });
      fetchBons();
    } catch (error) {
      console.error('Error deleting bons:', error);
    }
  };
  const handleEditBCE = () => {
    const bonsToEdit = bons.filter(bon => selectedRows.includes(bon.id));

    const bonsWithRecieved = bonsToEdit.filter(bon => bon.recieved > 0);
    if (bonsWithRecieved.length > 0) {
      const bonIds = bonsWithRecieved.map(bon => bon.id).join(', ');
      window.alert(`Bon ID: ${bonIds} has already started receiving orders. You cannot Edit it.`);
      return; // Exit the function without further execution
    }
    if (selectedRows.length === 1) {
      const selectedRow = bons.find(bon => bon.id === selectedRows[0]);
      setShowEditBCE(true);
      setSelectedRowForEdit(selectedRow);
     
    } else {
      // Show error message or handle the case where more than one row is selected
    }
  };

  return (
    <>
    {!showAddBCE && !showEditBCE && (
      <>
        <div className="flex text-center text-2xl m-2 font-medium justify-center">
          Bons De Commande Externes
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={bons}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={selectedRows}
            slots={
              
              {
            
              toolbar: CustomToolbar,
              
            }}
          />
        </div>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Fab onClick={handleAddBCE} color="success" aria-label="add">
            <AddIcon />
          </Fab>
          <Fab color="secondary" aria-label="edit" onClick={handleEditBCE}>
            <EditIcon />
          </Fab>
          <Fab color="error" aria-label="delete" onClick={handleDeleteBons}>
            <DeleteIcon />
          </Fab>
        </Box>
      </>
    )}
    {showAddBCE && <AddBCE selectedRowIds={selectedRows} goBack={handleGoBack} />}
    {showEditBCE && <EditBCE selectedRow={selectedRowForEdit} goBack={handleGoBack} />}
  </>
  
  );
};

export default BceManagement;
