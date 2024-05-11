import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridRowId, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import NavigationIcon from '@mui/icons-material/Navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBCI from './Forms/AddBCI.tsx';
import EditBCI from './Forms/EditBCI.tsx';
import { renderProgress } from '../render/renderProgress.tsx';
import saveAs from 'file-saver';
import Papa from 'papaparse';
interface Bon {
  id: number;
  creationDate: string;
  type: string;
}

const BCIsetShowAddBCIManagement: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [bons, setBons] = useState<Bon[]>([]);
  const [setShowAddBCI, setShowAddBCIsetShowAddBCI] = useState<boolean>(false);
  const [showEditBCIsetShowAddBCI, setShowEditBCIsetShowAddBCI] = useState<boolean>(false);
  const [selectedRowForEdit, setSelectedRowForEdit] = useState<Bon | null>(null);
  useEffect(() => {
    fetchBons();
    setBons([
      { id: 1, bonId: 1, nom_consemateur: "AZ", dateCreation: "DDMMYYYY", type: "BCI" },
      { id: 2, bonId: 2, nom_consemateur: "BY", dateCreation: "DDMMYYYY", type: "BCI" }
    ]);
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
    { field: 'dateCreation', headerName: 'Date De Création', width: 130 }, // Change field to 'creationDate'
    { field: 'type', headerName: 'Type', type: 'number', renderCell: renderProgress, width: 80 }, //Change field to 'Type'
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
    csvContent += "ID,N° Chapitre,Article,Date De Création,Type\n";
  
    // Add data rows
    bons.forEach(bon => {
      csvContent += `${bon.id},${bon.creationDate},${bon.type},}\n`;
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

  const handleAddBCIsetShowAddBCI = () => {
    setShowAddBCIsetShowAddBCI(true);
  };

  const handleGoBack = () => {
    setShowAddBCIsetShowAddBCI(false);
  };
  const handleDeleteBons = async () => {
  
    //const bonsToDelete = bons.filter(bon => selectedRows.includes(bon.id));
 
    const bonsWithRecieved = bonsToDelete.filter(bon => bon.recieved > 0);
    if (bonsWithRecieved.length > 0) {
      const bonIds = bonsWithRecieved.map(bon => bon.id).join(', ');
      const confirmDelete = window.confirm(`Bon ID: ${bonIds} has already started receiving orders. Do you want to proceed with deletion?`);
      if (!confirmDelete) return;
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
  const handleEditBCIsetShowAddBCI = () => {
    if (selectedRows.length === 1) {
      const selectedRow = bons.find(bon => bon.id === selectedRows[0]);
      setShowEditBCIsetShowAddBCI(true);
      setSelectedRowForEdit(selectedRow);
     
    } else {
      // Show error message or handle the case where more than one row is selected
    }
  };

  return (
    <>
    {!setShowAddBCI && !showEditBCIsetShowAddBCI && (
      <>
        <div className="flex text-center text-2xl m-2 font-medium justify-center">
          Bons De Commande Interne
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
        <Box sx={{ '& > :not(style)': { m: 1 } }} >
  <Fab onClick={handleAddBCIsetShowAddBCI} color="success" aria-label="add">
    <AddIcon />
  </Fab>
  <Fab color="secondary" aria-label="edit" onClick={handleEditBCIsetShowAddBCI}>
    <EditIcon />
  </Fab>
  <Fab color="error" aria-label="delete" onClick={handleDeleteBons}>
    <DeleteIcon />
  </Fab>
  <button
        className={` ml-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 `}
        //onClick={handleValidate}
      >
        valider
      </button>
</Box>

      </>
    )}
    {setShowAddBCI && <AddBCI selectedRowIds={selectedRows} goBack={handleGoBack} />}
    {/* {{showEditBCIsetShowAddBCI && <EditBCI selectedRow={selectedRowForEdit} goBack={handleGoBack} />} } */}
  </>
  
  );
};

export default BCIsetShowAddBCIManagement;
