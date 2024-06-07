

import axios from 'axios';
import { DataGrid, GridRowId, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Fab } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

import EditBCI from './Forms/EDITBCI.tsx';
import { renderBCIProgress } from '../render/renderBCIProgress.tsx';
import { useEffect, useState } from 'react';
import React from 'react';
  
interface Bon {
  id: number;
  dateCreation: string;
  typee: string;
  isSeenByDR : boolean
  isSeenByRSR :boolean;
  name : string;
}

const BDRManagement: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [bons, setBons] = useState<Bon[]>([]);
  const [ShowAddBCI, setShowAddBCI] = useState<boolean>(false);
  const [showEditBCI, setShowEditBCI] = useState<boolean>(false);
  const [selectedRowForEdit, setSelectedRowForEdit] = useState<Bon []>([]);
  useEffect(() => {
    fetchBons();
    
  }, []);

  const fetchBons = async () => {
    try {
      const response = await axios.get('/api/getBCIs');
      // Add a unique identifier to each row object
      const bonsWithIds = response.data.map((bon, index) => ({
        ...bon,
        id: bon.bciId, // Use the index as a simple unique identifier
      }));
     
      setBons(bonsWithIds.filter(bon => bon.isSeenByDR === 1 && bon.isSeenByRSR ===1 && bon.typee ==='Décharge' ));
    } catch (error) {
      console.error('Error fetching bons:', error);
    }
  };
  

  const columns: GridColDef[] = [
    { field: 'bciId', headerName: 'ID', width: 70 }, 
    { field: 'dateCreation', headerName: 'Date De Création', width: 130 }, 
    { field: 'typee', headerName: 'Type', type: 'number', width: 80 }, 
    { field: 'progress', headerName: 'Progress', renderCell: renderBCIProgress, width: 500 }, 
    { field: 'name', headerName: 'Consommateur', width: 500 }, 
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
     
    setSelectedRows(newSelection[1]); 
    
    setSelectedRowForEdit(bons.filter(bon =>bon.id === newSelection[1]));
    
  };

  const handleAddBCI = () => {
    setShowAddBCI(true);
  };

  const handleGoBack = () => {
    setShowEditBCI(false);
    setShowAddBCI(false);
  };


  //handle DELETE BCIs
  const handleDeleteBons = async () => {
    const bonsWithProgress = bons.filter(bon => bon.id === parseInt(selectedRows) && bon.isSeenByRSR === 1);
  
    if (bonsWithProgress.length > 0) {
      
      alert(`the selected bon has already treated by RSR and can't be deleted`);
      return; // Exit the function without further execution
    }
    try {
      
      await axios.delete('/api/deleteBCIs', {
        data: { selectedRows }
      });
      
      fetchBons();
    } catch (error) {
      console.error('Error deleting bons:', error);
    }
  };

  //handle EDIT BCIs
  const handleEditBCI = () => {
   
    if (selectedRowForEdit.length === 1) {
     
      setShowEditBCI (true);
      
     
    } else {
      alert('Please select a single row to edit');
    }
  };

  return (
    <>
    {!ShowAddBCI && !showEditBCI && (
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
       
    <button style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleEditBCI}>
      Add BD
    </button>
  <Fab color="error" aria-label="delete" onClick={handleDeleteBons}>
    <DeleteIcon />
  </Fab>
 
</Box>

      </>
    )}
     {showEditBCI && <EditBCI selectedBCIRow={selectedRowForEdit[0]} goBack={handleGoBack} />} 
  </>
  
  );
};

export default BDRManagement;
