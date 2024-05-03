import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";

function AddBCE() {
  return (
    <TextField
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
      id="outlined-number"
      label="Quntiter"
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}

export default AddBCE;
