import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"; // Import Button from Material-UI

function AddBCI() {
  return (
    <div>
    <div className="flex gap-4">
      
      <TextField
        required
        id="product"
        label="Product"
        className="flex-1 mr-6"
      />
      <TextField
        id="quantite"
        label="Quantité"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        className="flex-1 mr-6"
      />
      <Button variant="contained" color="primary" size="small">Add Ligne</Button>
      
    </div>
    <div className="min-h-screen flex flex-col justify-between">
    <div>
        
    </div>
    <Button
    variant="contained"
    color="primary"
    size="large"
    className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
  >
    Validate
  </Button>
    </div>
    </div>
  );
}

export default AddBCI;
