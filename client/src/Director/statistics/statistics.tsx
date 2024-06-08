import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Autocomplete } from '@mui/material';
import axios from 'axios';

function createData(produit: string, chapiter: string, article: string, quntiter: number) {
  return { produit, chapiter, article, quntiter };
}

const rows = [
  createData('mouse', 'Chapiter_mouse', 'Article_mouse', 24),
  createData('keybourd', 'Chapiter_keybourd', 'Article_keybourd', 24),
  createData('PC', 'Chapiter_PC', 'Article_PC', 24),
  createData('mouse', 'Chapiter_mouse', 'Article_mouse', 24),
];

type Consommateur = {
  userId: String;
  name: String;
};

type Produit = {
  produitId: String;
  designation: String;
};

const ConsomateurComponent = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [valueFin, setValueFin] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [List, setList] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [consommateurs, setConsommateurs] = React.useState<Consommateur[]>([]);
  const[selectedConsommateur , setSelectedConsommateur] = React.useState<String[]>([]);
  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    const consommateur = consommateurs.filter((consommateur) =>
      consommateur.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
  };
  const handleConsommateurClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedConsommateur(event.target.value);

    const consommateur = consommateurs.filter((consommateur) =>
      consommateur.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
  };
  React.useEffect(() => { 
    fetch('/consommateurs')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
         
          setConsommateurs(data);
         
        } else {
          console.error('Invalid data format:', data);
          console.warn(data)
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        {/* Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date de début"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            sx={{ width: '50%' }}
          />
        </LocalizationProvider>

        {/* Date Picker */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date de fin"
            value={valueFin}
            onChange={(newValue) => setValueFin(newValue)}
            sx={{ width: '50%' }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 365 }}>
          <Autocomplete
            options={consommateurs}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Consommateurs"
                variant="outlined"
                
                onChange={handleSearchTermChange}
              />
            )}
            
          />
        </FormControl>

        {/* Select Button */}
        <Button variant="contained" sx={{ minWidth: 100 }}>Select</Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Produit</strong></TableCell>
              <TableCell align="right"><strong>Chapiter</strong></TableCell>
              <TableCell align="right"><strong>Article</strong></TableCell>
              <TableCell align="right"><strong>Quntiter</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.produit}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.produit}
                </TableCell>
                <TableCell align="right">{row.chapiter}</TableCell>
                <TableCell align="right">{row.article}</TableCell>
                <TableCell align="right">{row.quntiter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const ProduitComponent = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [valueFin, setValueFin] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [List, setList] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setList(event.target.value as string);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        {/* Date début */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date de début"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            sx={{ width: '50%' }}
          />
        </LocalizationProvider>

        {/* Date fin */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date de fin"
            value={valueFin}
            onChange={(newValue) => setValueFin(newValue)}
            sx={{ width: '50%' }}
          />
        </LocalizationProvider>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Produit</strong></TableCell>
              <TableCell align="right"><strong>Chapiter</strong></TableCell>
              <TableCell align="right"><strong>Article</strong></TableCell>
              <TableCell align="right"><strong>Quntiter</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.produit}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.produit}
                </TableCell>
                <TableCell align="right">{row.chapiter}</TableCell>
                <TableCell align="right">{row.article}</TableCell>
                <TableCell align="right">{row.quntiter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const CombinedComponent = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
        <Tab label="Consommateur" />
        <Tab label="Produit" />
      </Tabs>
      <Box role="tabpanel" hidden={tabIndex !== 0}>
        {tabIndex === 0 && <ConsomateurComponent />}
      </Box>
      <Box role="tabpanel" hidden={tabIndex !== 1}>
        {tabIndex === 1 && <ProduitComponent />}
      </Box>
    </Box>
  );
};

export default CombinedComponent;
