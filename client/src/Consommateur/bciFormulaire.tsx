import React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
type Props = {}

const bciFormulaire = (props: Props) => {
    const [chapitre, setChapitre] = React.useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setChapitre(event.target.value as string);
  };
  return (
    <Box sx={{ minWidth: 120 }}>
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Chapitre</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={chapitre}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value={10}>Ten</MenuItem>
       
      </Select>
    </FormControl>
  </Box>
    )
}

export default bciFormulaire;