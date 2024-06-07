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

function createData(produit: string, chapiter: string, article: string, quntiter: number) {
  return { produit, chapiter, article, quntiter };
}

const rows = [
  createData('mouse', 'Chapiter_mouse', 'Article_mouse', 24),
  createData('keybourd', 'Chapiter_keybourd', 'Article_keybourd', 24),
  createData('PC', 'Chapiter_PC', 'Article_PC', 24),
  createData('mouse', 'Chapiter_mouse', 'Article_mouse', 24),
];

const ConsomateurComponent = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [List, setList] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setList(event.target.value as string);
  };

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
            value={value}
            onChange={(newValue) => setValue(newValue)}
            sx={{ width: '50%' }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Search Field */}
        <TextField fullWidth label="Rechercher" id="rech" />

        {/* Select Button */}
        <FormControl sx={{ minWidth: 365 }}>
          <InputLabel id="demo-simple-select-label">List</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={List}
            label="List"
            onChange={handleChange}
          >
            <MenuItem value={10}>Consomateur_1</MenuItem>
            <MenuItem value={20}>Consomateur_2</MenuItem>
            <MenuItem value={30}>Consomateur_3</MenuItem>
          </Select>
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



const ServerComponent = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const [List, setList] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setList(event.target.value as string);
  };

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
            value={value}
            onChange={(newValue) => setValue(newValue)}
            sx={{ width: '50%' }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Search Field */}
        <TextField fullWidth label="Rechercher" id="rech" />

        {/* Select Button */}
        <FormControl sx={{ minWidth: 365 }}>
          <InputLabel id="demo-simple-select-label">List</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={List}
            label="List"
            onChange={handleChange}
          >
            <MenuItem value={10}>Service_1</MenuItem>
            <MenuItem value={20}>Service_2</MenuItem>
            <MenuItem value={30}>Service_3</MenuItem>
          </Select>
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
            value={value}
            onChange={(newValue) => setValue(newValue)}
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




export default function CombinedComponent() {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ width: '100%' }} >
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
        <Tab label="Service" />
        <Tab  label="Consommateur" />
        <Tab  label="Produit" />
      </Tabs>
      <Box role="tabpanl" hidden={tabIndex !== 0}>
        {tabIndex === 0 && <ConsomateurComponent />}
      </Box>  
      <Box role="tabpanel" hidden={tabIndex !== 1}>
        {tabIndex === 1 && <ServerComponent />}
      </Box>
      <Box role="tabpanel" hidden={tabIndex !== 2}>
        {tabIndex === 2  && <ProduitComponent />}
      </Box>
      
    </Box>
  );
}
