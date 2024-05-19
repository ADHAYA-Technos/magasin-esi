import React, { useEffect, useState } from 'react';
import FilterRoundedIcon from '@mui/icons-material/TuneRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { RoleColumns } from './columns';
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RolesManage = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/roles', { withCredentials: true });
            setData(response.data);
			console.warn(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value === '') {
            setData([]);
            fetchData();
        } else {
            const filteredData = data.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setData(filteredData);
        }
    };

    const onSelectionModelChange = (ids) => {
		console.warn(ids);
        setSelectedRowIds(ids);
        const selectedIDs = new Set(ids);
        const selectedRowData = data.filter((row) => selectedIDs.has(row.id));
        setSelectedData(selectedRowData);
		
    };

    return (
        <div className='flex flex-row h-full rounded-lg'>
            <div className='flex flex-col flex-grow h-full bg-white rounded-lg'>
                <div className='flex flex-grow-0 flex-shrink basis-auto items-center w-full'>
                    <form className='flex-grow ml-4'>
                        <div className='bg-grey rounded-lg w-full my-4'>
                            <input
                                className='bg-grey rounded-lg w-full h-10 pl-4 font-light'
                                placeholder='Rechercher des Rôles'
                                type='text'
                                id='search'
                                name='search'
                                value={search}
                                onChange={handleChange}
                            />
                        </div>
                    </form>

                    <div className='invisible flex items-center justify-center cursor-pointer h-10 w-10 mx-4 my-4 bg-white border-[2px] rounded-lg border-[#24272C] '>
                        <FilterRoundedIcon />
                    </div>
                    <Link to='/admin/role/add' style={{ textDecoration: 'none' }}>
                        <div className='flex justify-center items-center cursor-pointer h-10 bg-Primary rounded-lg text-white mr-4 my-4 px-4 gap-2'>
                            <AddRoundedIcon />
                            <p className='text-white font-medium'>Créer un rôle</p>
                        </div>
                    </Link>
                </div>
                <div
                    style={{ height: '100%', width: '100%' }}
                    className='flex-grow flex-shrink basis-auto'>
                    <DataGrid
                        rows={data}
                        columns={RoleColumns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[10]}
                        checkboxSelection
                        rowSelectionModel={selectedRowIds}
                        onRowSelectionModelChange={onSelectionModelChange}
                        disableRowSelectionOnClick
                    />
                </div>
            </div>

            <div
                className={`flex flex-col flex-grow-0 overflow-y-auto h-full ml-5 w-1/3 bg-white rounded-lg ${
                    selectedRowIds.length === 1
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-50'
                } `}>
                <p className='mx-6 mt-6 mb-3 font-semibold text-Primary text-2xl '>
                    Permissions
                </p>
                <p className='mx-6 mb-5 font-light text-Primary text-[12px]'>
                    Vous pouvez choisir les autorisations que vous souhaitez activer pour
                    ce rôle
                </p>
                {selectedData.length === 1 && (
                    <>
						{
							data.find(data => data.id === selectedData[0].id).permissions.map((permission, index) => (
								<Permission
									key={index}
									title={permission}
									description={permission}
									isOpen={permission.isOpen}
								/>
							))
						}
                        
                    </>
                )}
            </div>
        </div>
    );
};

/*** PERMISSION COMPONENT ***/

const Permission = ({ title, description, isOpen }) => {
    const [checked, setChecked] = useState(isOpen);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <div className='flex flex-col items-center my-2.5 mx-6'>
            <div className='flex items-center w-full'>
                <p className='flex-grow flew-shrink font-semibold text-Primary text-[14px]'>
                    {title}
                </p>
                <DarkSwitch
                    className='flex-grow-0 flew-shrink'
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
            <p className='font-light text-Primary text-[12px]'>{description}</p>
        </div>
    );
};

/*** PERMISSION SWITCH COLOR ***/

const DarkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        'color': grey[900],
        '&:hover': {
            backgroundColor: alpha(grey[900], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: grey[900],
    },
}));

export default RolesManage;
