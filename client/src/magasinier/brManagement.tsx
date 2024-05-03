import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridRowId, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import NavigationIcon from '@mui/icons-material/Navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBCE from './Forms/AddBR.tsx';
import EditBCE from './Forms/EditBR.tsx';
import { renderProgress } from '../render/renderProgress.tsx';
import saveAs from 'file-saver';
import Papa from 'papaparse';
import EditBR from './Forms/EditBR.tsx';
import AddBR from './Forms/AddBR.tsx';
interface Bon {
  id: number;
  numChapitre: string;
  articleName: string;
  creationDate: string;
  fournisseur: string;
  recieved: number;
  prix: string;
}
interface BonRec {
  id: number;
  creationDate: string;
  bonId : number;
}

const BRManagement: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<number>();
  const [selectedBCE, setSelectedBCE] = useState<Bon>();
  const [selectedBRRows, setSelectedBRRows] = useState<number>([]);
  const [bons, setBons] = useState<Bon[]>([]);
  const [bonsRec, setBonRec] = useState<BonRec[]>([]);
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
  


  const fetchBonsRec = async (bonId: number) => {
    try {
      const response = await axios.get(`/api/getBonRec/${bonId}`);
      const rowsWithId = response.data.map((row: { bonRecId: any; }) => ({ ...row, id: row.bonRecId }));
      setBonRec(rowsWithId);
    } catch (error) {
      console.error('Error fetching BRs:', error);
    }
  };
  //BR SELECTION CHANGE HANDLER
  const handleBRSelectionChange = (newSelection: GridRowId[]) => {
    setSelectedBRRows(newSelection[0]); 
  };
  
    //BCE SELECTION CHANGE HANDLER
  const handleBCESelectionChange = (newSelection: GridRowId[]) => {
    const selectedBCE = bons.find(bon => bon.bonId === newSelection[0]);
    setSelectedBCE(selectedBCE);
    // Get the new selected row ID
    const newSelectedBCEId = newSelection.length > 0 ? bons.find(bon => bon.id === newSelection[0])?.id : undefined;
  
    // If a different row is selected, fetch its BRs and clear the previous selection
    if (newSelectedBCEId !== selectedRows) {
      setSelectedRows(newSelectedBCEId);
      fetchBonsRec(newSelectedBCEId);
      setBonRec([]); // Clear the BRs for the previous selection
    } else {
      // If the same row is clicked again, deselect it
      setSelectedRows(undefined);
      setBonRec([]); // Clear the BRs
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

  const BRcolumns: GridColDef[] = [
    { field: 'bonRecId', headerName: 'ID du BR', width: 70 }, // Change field to 'id'
    { field: 'dateCreation', headerName: 'Date De Création', width: 130 }, // Change field to 'creationDate'
    { field: 'bonId', headerName: 'ID du BCE', width: 130 }, // Change field to 'fournisseur'
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
 
  const handleAddBCE = () => {
    setShowAddBCE(true);
  };

  const handleGoBack = () => {
    setShowAddBCE(false);
  };
  const handleDeleteBons = async () => {
  
    const bonsToDelete = bons.filter(bon => selectedRows.includes(bon.id));
 
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
  const handleEditBCE = () => {
    setSelectedRowForEdit(selectedRows);
      setShowEditBCE(true);
      
      
  
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
            onRowSelectionModelChange={handleBCESelectionChange}
            rowSelectionModel={selectedRows }
            
            slots={
              
              {
            
              toolbar: CustomToolbar,
              
            }}
          />
        </div>
       
        <button style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleEditBCE}>
      Add BR
    </button>
 
        <div className="flex text-center text-2xl m-2 font-medium justify-center">
          Bons De Reception
        </div>
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
  rows={bonsRec}
  columns={BRcolumns}
  checkboxSelection
  onRowSelectionModelChange={handleBRSelectionChange}
  rowSelectionModel={selectedBRRows ? [selectedBRRows] : []} 
  slots={{
    toolbar: CustomToolbar,
  }}
/>
        </div>
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Fab color="secondary" aria-label="edit" onClick={handleEditBCE}>
            <EditIcon />
          </Fab>
          <Fab color="error" aria-label="delete" onClick={handleDeleteBons}>
            <DeleteIcon />
          </Fab>
        </Box>
       
      </>
    )}
    {showAddBCE && <AddBR selectedRowIds={selectedRows} goBack={handleGoBack} />}
    {showEditBCE && <EditBR selectedRow={selectedBCE} goBack={handleGoBack} />}
  </>
  
  );
};

export default BRManagement;
