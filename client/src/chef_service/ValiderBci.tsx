import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridRowId, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

interface Bon {
  id: number;
  bonId: number;
  nom_consemateur: string;
  dateCreation: string;
  type: string;
}

interface Produit {
  id: number;
  prodoi: number;
  quntiti: number;
  newQuntiti: number;
}

const ValiderBci: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const [bons, setBons] = useState<Bon[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [showAddBCI, setShowAddBCI] = useState<boolean>(false);
  const [showEditBCI, setShowEditBCI] = useState<boolean>(false);
  const [selectedRowForEdit, setSelectedRowForEdit] = useState<Bon | null>(null);
  const [newQuantity, setNewQuantity] = useState<number | undefined>(undefined); // State for storing new quantity

  useEffect(() => {
    setBons([
      { id: 1, bonId: 1, nom_consemateur: "AZ", dateCreation: "DDMMYYYY", type: "BCI" },
      { id: 2, bonId: 2, nom_consemateur: "BY", dateCreation: "DDMMYYYY", type: "BCI" }
    ]);
  }, []);

  const fetchProduits = async (bonId: number) => {
    try {
      const response = await axios.get(`/api/getProduits/${bonId}`);
      setProduits(response.data);
    } catch (error) {
      console.error('Error fetching produits:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'bonId', headerName: 'ID', width: 50 },
    { field: 'nom_consemateur', headerName: 'nom_consemateur', width: 150 },
    { field: 'dateCreation', headerName: 'Date De Création', width: 150 },
    { field: 'type', headerName: 'TYPE', width: 100 },
  ];

  const columnsTable2: GridColDef[] = [
    { field: 'prodoi', headerName: 'Produit', width: 100 },
    { field: 'quntiti', headerName: 'Quantité', width: 100 },
    { field: 'newQuntiti', headerName: 'Nouvelle Quantité', width: 150, editable: true },
  ];

  const handleSelectionChange = (newSelection: GridRowId[]) => {
    setSelectedRows(newSelection);
    if (newSelection.length === 1) {
      const selectedRow = bons.find(bon => bon.id === newSelection[0]);
      setSelectedRowForEdit(selectedRow || null);
      fetchProduits(selectedRow!.bonId);
      setNewQuantity(undefined); // Reset new quantity state when a new row is selected
    } else {
      setSelectedRowForEdit(null);
    }
  };

  const handleUpdateQuantity = () => {
    if (selectedRowForEdit && newQuantity !== undefined) {
      const updatedRow = { ...selectedRowForEdit, newQuntiti: newQuantity };
      setSelectedRowForEdit(updatedRow);
      // Call your API or perform any other logic here to update the quantity
      console.log('Updated Quantity:', newQuantity);
    }
  };

  return (
    <>
      {!showAddBCI && !showEditBCI && (
        <>
          <div className="flex text-center text-2xl m-2 font-medium justify-center">
            Bons De Commande Interne
          </div>
          <div style={{ height: 400, width: '100%', margin: '0 auto' }}>
            <DataGrid
              rows={bons}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedRows}
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </div>
          <Box>
            <Button
              variant="contained"
              style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', marginTop: '15px' }}
            >
              Supprimer
            </Button>
          </Box>
        </>
      )}
      {selectedRowForEdit && (
        <div style={{ marginTop: '20px' }}>
          <div className="flex text-center text-2xl m-2 font-medium justify-center">
            Table 2
          </div>
          <div style={{ height: 200, width: '100%', margin: '0 auto' }}>
            <DataGrid
              rows={[
                { ...selectedRowForEdit, prodoi: 1, quntiti: 10, newQuntiti: newQuantity },
                { ...selectedRowForEdit, prodoi: 2, quntiti: 15, newQuntiti: selectedRowForEdit.newQuntiti },
              ]}
              columns={columnsTable2}
              checkboxSelection
              onEditCellChange={(params) => {
                const updatedRow = { ...selectedRowForEdit, [params.field]: params.props.value };
                setSelectedRowForEdit(updatedRow);
              }}
              rowSelectionModel={[]}
            />
          </div>
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <TextField
              type="number"
              label="Nouvelle Quantité"
              value={newQuantity !== undefined ? newQuantity : selectedRowForEdit.newQuntiti}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10) || 0;
                setNewQuantity(newValue);
              }}
              style={{ marginRight: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateQuantity}
            >
              Valider
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ValiderBci;
