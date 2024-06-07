import React, { useState, useEffect,useCallback } from 'react';
import FilterRoundedIcon from '@mui/icons-material/TuneRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import axios from 'axios';
import { debounce } from 'lodash';
import AddIcon from '@mui/icons-material/Add';

import { Fab } from '@mui/material';
import AddUser from './Forms/AddUser.tsx';
type Props = {}

const UsersManagement = (props: Props) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState([]);

  const handleDelete = async (id) => {
    await axios({
        method: 'DELETE',
        url: `http://localhost:5000/users/${id}`,
        withCredentials: true,
    });
    fetchData(); // Refetch data after delete
};

const fetchData = async () => {
  const response = await axios({
      method: 'GET',
      url: 'http://localhost:5000/users',
      withCredentials: true,
  });
  const dataWithId = response.data.map(item => ({
      ...item,
      id: item.userId  // Use userId as the unique id for each row
  }));
  setData(dataWithId);
  setSearchQuery(dataWithId);
};

useEffect(() => {
  fetchData();
}, []); // Only run on component mount
const debouncedSearch = useCallback(
  debounce((value) => {
      if (value === '') {
          setSearchQuery(data);
      } else {
          const filteredData = data.filter((item) =>
              (item.name + ' ' + item.surname)
                  .toLowerCase()
                  .includes(value.toLowerCase())
          );
          setSearchQuery(filteredData);
      }
  }, 300),
  [data]
);
const handleAddUser = () => {
  setShowAddUser(true);
};

const handleGoBack = () => {
  setShowEditUser(false);
  setShowAddUser(false);
};


const handleChange = (e) => {
  const value = e.target.value;
  setSearch(value);
  debouncedSearch(value);
};

const handleSelectedRows = (ids) => {
  const selectedIDs = new Set(ids);
  const selectedRowData = data.filter((row) =>
      selectedIDs.has(row.id.toString())
  );
};

//USERS COLUMNS
const UserColumns = [
  {
    field: 'lastName',
    headerName: 'Nom & Prénom',
    width: 300,
    renderCell: function (params) {
      return (
        <div className='flex flex-row items-center gap-4'>
          <img
            src={
              params.row.imageUrl === null
                ? 'https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg'
                : params.row.imageUrl
            }
            alt='image'
            className='rounded-full h-8 w-8'
          />
          <p>
            {params.row.name} {params.row.surname}
          </p>
        </div>
      );
    },
  },
  { field: 'telephone', headerName: 'Téléphone', width: 160 },
  { field: 'email', headerName: 'Adress Email', width: 225 },
  {
    field: 'roles',
    headerName: 'Rôles',
    width: 325,
    sortable: false,
    renderCell: (params) => {
      const roles = params.row.roles.map((role) => role?.role);
      const colors = params.row.roles.map((role) => {
        if (role) return `${role.color}${Math.round(0.2 * 255).toString(16)}`;
        else return '';
      });
      return (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap', // Ensure badges wrap to the next line
            maxWidth: '300px', // Limit the maximum width
            overflow: 'hidden',
          }}
          className='flex flex-row items-center gap-2'>
          {roles.map((role, index) => {
            return (
              <div
                key={index}
                className='rounded-full text py-1.5 px-4 text-[13px] whitespace-nowrap' // Added `whitespace-nowrap`
                style={{ backgroundColor: colors[index] }}>
                <p
                  className='font-semibold'
                  style={{ color: colors[index].slice(0, -2) }}>
                  {role}
                </p>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    sortable: false,
    renderCell: (params) => {
      return (
        <div className='flex flex-row items-center gap-4'>
          {params.row.name ? (
            <Link to='/adduser' state={params.row}>
              <EditOutlinedIcon className='cursor-pointer' />
            </Link>
          ) : (
            <Link
              className='invisible'
              to='/adduser'
              state={params.row}>
              <EditOutlinedIcon />
            </Link>
          )}
          <DeleteOutlinedIcon
            onClick={() => handleDelete(params.row.id)}
            className='text-[#D11B2D] cursor-pointer'
          />
        </div>
      );
    },
  },
];

  return (<>
  {!showAddUser &&<>
    <div className='flex flex-col  bg-white rounded-lg'>
    <div className='flex flex-grow-0 flex-shrink basis-auto items-center w-full'>
        <form className='flex-grow ml-4'>
            <div className='bg-grey rounded-lg w-full my-4'>
                <input
                    className='bg-grey rounded-lg w-full h-10 pl-4 font-light'
                    placeholder='Rechercher des Utilisateurs'
                    type='text'
                    id='search'
                    name='search'
                    value={search}
                    onChange={handleChange}
                />
            </div>
        </form>

        <div className='flex items-center justify-center cursor-pointer h-10 w-10 mx-4 my-4 bg-white border-[2px] rounded-lg border-[#24272C] '>
            <FilterRoundedIcon />
        </div>
        <Link to='/users/adduser' style={{ textDecoration: 'none' }}>
            <div className='flex justify-center items-center cursor-pointer h-10 bg-Primary rounded-lg text-white mr-4 my-4 px-4 gap-2'>
                <AddRoundedIcon />
                <p className='text-white font-medium'>Ajouter un utilisateur</p>
            </div>
        </Link>
    </div>

    <div style={{ height: '100%', width: '100%' }} className='flex-grow flex-shrink basis-auto'>
        <DataGrid
            rows={searchQuery}
            columns={UserColumns}
            onRowSelectionModelChange={(ids) => handleSelectedRows(ids)}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
        />
    </div>

    
</div>
<Fab onClick={handleAddUser} title='ADD USER'  color="success" aria-label="add">
            <AddIcon />
          </Fab>
          </>
        }
          {showAddUser && <AddUser goBack={handleGoBack} />}
    
</>
  )
}

export default UsersManagement