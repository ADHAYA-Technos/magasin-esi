import React, { useState } from 'react';
import ArrowRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import ColorPicker, { themes } from 'react-pick-color';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { grey } from '@mui/material/colors';
import { useEffect } from 'react';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { permission } from 'process';

const AddRole = () => {
    const [value, setValue] = React.useState('1');
	const [selectedRole, setSelectedRole] = useState({});
	const [isEdited, setIsEdited] = useState(false);
	const [data, setData] = useState([]);
    const [permissions, setPermissions] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const response = await axios({
				method: 'GET',
				url: 'http://localhost:5000/roles',
				withCredentials: true,
			});
         
			setData(response.data);
			    
		}
		fetchData();
	}, []);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleRoleClick = (item) => {
		if (isEdited) {
			/*** WARNING ***/
			console.log('WARNING!! You must save changes');
		} else {
			setSelectedRole(item);
		}
	};

	const handleDisplayChange = (name, color) => {
		setIsEdited(true);
		setSelectedRole({ ...selectedRole, name, color });
	};

	const handlePermissionsChange = (permissions) => {
		setIsEdited(true);
		setSelectedRole({ ...selectedRole, permissions });
	};

	const saveChanges = async () => {
		const response = selectedRole.new
			? await axios({
					method: 'POST',
					url: 'http://localhost:5000/roles',
					data: {
						id: selectedRole.id,
						role: selectedRole.name,
						color: selectedRole.color,
					},
					withCredentials: true,
			  })
			: await axios({
					method: 'PUT',
					url: 'http://localhost:5000/admin/roles',
					data: {
						role: selectedRole.name,
						color: selectedRole.color,
					},
					withCredentials: true,
			  });
		setIsEdited(false);
	};

	const cancelChanges = () => {
		//setIsEdited(false);
		//const originalData = _.cloneDeep(clonedData);
		//const originalSelectedRole = originalData[selectedRole.id - 1];
		//setSelectedRole(originalSelectedRole);
	};

	const createNewRole = () => {
		const newRole = {
			id: data[data.length - 1].id + 1,
			name: 'nouveau rôle',
			//members: 0,
			//permissions: [false, false, false, false, false, false],
			color: '#2A2A2A',
			new: true,
		};
		//const newData = [...clonedData, newRole];
		//setClonedData(newData);
		setSelectedRole(newRole);
		setData([...data, newRole]);
	};

	//useEffect(() => {}, [selectedRole]);

	return (
		<div className='flex flex-row h-full rounded-lg'>
			{/*** FIRST SECTION ***/}
			<section className='flex flex-col flex-grow-0 w-1/3 h-full bg-white rounded-lg px-6 py-6 overflow-y-auto'>
				<div className='flex flex-row items-center justify-between'>
					<Link to='/admin/roles'>
						<div className='px-1 py-1 bg-grey rounded-full cursor-pointer'>
							<ArrowRoundedIcon />
						</div>
					</Link>

					<p className='text-Primary font-semibold text-2xl'>Rôles</p>
					<div
						className='px-1 py-1 bg-grey rounded-full cursor-pointer'
						onClick={createNewRole}>
						<AddRoundedIcon />
					</div>
				</div>
				<div className='flex flex-col my-10 items-start gap-4'>
					{data.map((item) => {
						const name = item.name;
						const color = item.color;
						return (
							<div key={item.id} onClick={() => handleRoleClick(item)}>
								<RoleContainer
									id={item.id}
									name={name}
									color={color}
									selected={selectedRole}
									editedName={selectedRole.name}
									editedColor={selectedRole.color}
								/>
							</div>
						);
					})}
				</div>
			</section>

			{/*** SECOND SECTION ***/}

			<section
				className={`${
					selectedRole.name ? 'opacity-100' : 'pointer-events-none opacity-50'
				} flex flex-col flex-grow h-full ml-5 bg-white rounded-lg overflow-y-auto`}>
				<div className='flex flex-row items-center justify-center mt-6 mb-3'>
					<p className='flex flex-grow mx-6 font-semibold text-Primary text-2xl '>
						Modifier le rôle 
					</p>
					{isEdited && (
						<>
							<button
								className='flex flex-grow-0 items-center font-medium text-[12px] cursor-pointer h-8 border-[2px] border-Primary rounded-lg text-Primary py-4 px-4 bg-red-600 text-white'
								onClick={cancelChanges}>
								Annuler
							</button>
							<button
								className='flex flex-grow-0 items-center font-medium text-[12px] justify-center cursor-pointer h-8 bg-Primary border-[2px] border-Primary rounded-lg text-white bg-green-800 mr-6 ml-4 py-4 px-4'
								onClick={saveChanges}>
								Enregistrer les modifications
							</button>
						</>
					)}
				</div>

				<div>
					<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
						<TabContext value={value} sx={{ width: '100%' }}>
							<Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
								<Tabs
									value={value}
									onChange={handleChange}
									textColor='inherit'
									indicatorColor='primary'
									centered>
									<Tab label='Affichage' value='1' />
									<Tab label='Permissions' value='2' />
								</Tabs>
							</Box>
							<TabPanel value='1'>
								<Display
									roleName={selectedRole.name}
									roleColor={selectedRole.color}
									handleDisplayChange={handleDisplayChange}
								/>
							</TabPanel>
							<TabPanel value='2'>
								<Permissions
									rolePermissions={selectedRole.permissions}
									handlePermissionsChange={handlePermissionsChange}
								/>
							</TabPanel>
							<TabPanel value='3'>
								<Members />
							</TabPanel>
						</TabContext>
					</Box>
				</div>
			</section>
		</div>
	);
};

const RoleContainer = ({
	id,
	name,
	color,
	selected,
	editedName,
	editedColor,
}) => {
	const opacity = 0.2;
	const colorWithOpacity = `${
		id === selected.id ? editedColor : color
	}${Math.round(opacity * 255).toString(16)}`;
	return (
		<div
			className={`${
				selected.id === id
					? 'border-Primary border-[2px]'
					: 'border-white border-[2px]'
			} hover:border-[2px] hover:border-Primary cursor-pointer rounded-full text py-1.5 px-4 text-[13px]`}
			style={{ backgroundColor: colorWithOpacity }}>
			<p
				className='font-semibold'
				style={{ color: id === selected.id ? editedColor : color }}>
				{id === selected.id ? editedName : name}
			</p>
		</div>
	);
};

const Display = ({ roleName, roleColor, handleDisplayChange }) => {
	const [color, setColor] = useState('');
	const [name, setName] = useState('');

	useEffect(() => {
		if (roleName) {
			setName(roleName);
			setColor(roleColor);
		}
	}, [roleName, roleColor]);

	const handleNameChange = (e) => {
		setName(e.target.value);
		handleDisplayChange(e.target.value, color);
	};

	const handleColorChange = (color) => {
		setColor(color.hex);
		handleDisplayChange(name, color.hex);
	};

	return (
		<div className='w-full'>
			<span style={{ display: 'inline-block', width: '100%' }}>
				<label
					htmlFor='html'
					className='font-semibold ml-2 text-Primary'
					style={{ display: 'block' }}>
					Nom du rôle <span className='text-[#FF0000]'>*</span>
				</label>
				<input
					className='bg-grey rounded-lg px-4 h-10 font-medium text-[14px] mt-2 w-1/2'
					type='text'
					name='role'
					id='role'
					placeholder='Entrer le nom du rôle...'
					value={name}
					onChange={handleNameChange}
				/>
			</span>

			<div className='flex flex-col mt-10'>
				<p className='font-semibold text-Primary ml-2'>
					Colour du rôle <span className='text-[#FF0000]'>*</span>
				</p>
				<p className='font-light text-Primary ml-2 text-[12px]'>
					Cela vous permet de personnaliser facilement l'apparence des rôles,
				</p>
				<p className='font-light text-Primary ml-2 text-[12px]'>
					en leur donnant un aspect unique et attrayant visuellement.
				</p>
				<ColorPicker
					className='mt-6'
					color={color}
					onChange={handleColorChange}
					theme={themes.dark}
				/>
			</div>
		</div>
	);
};

const Permissions = ({ rolePermissions, handlePermissionsChange }) => {
	const [permissions, setPermissions] = useState(rolePermissions);

	useEffect(() => {
		setPermissions(rolePermissions);
	}, [rolePermissions]);

	const handlePermissionChange = (id, checked) => {
		const newPermissions = permissions;
		newPermissions[id - 1] = checked;
		setPermissions(newPermissions);
		handlePermissionsChange(newPermissions);
	};

	return (
		<div>
			<p className='font-semibold text-Primary ml-2'>
				Permissions <span className='text-[#FF0000]'>*</span>
			</p>

            {rolePermissions.map(permission => (

                <Permission
                    id={permission.id}
                    title={permission}
                    description={permission.description}
                    isOpen={permission.isOpen}
                    handlePermissionChange={handlePermissionChange}
                />
            ))};
		
			
		</div>
	);
};

const Members = () => {
	return <></>;
};

/*** PERMISSION COMPONENT ***/

const Permission = ({
	id,
	title,
	description,
	isOpen,
	handlePermissionChange,
}) => {
	const [checked, setChecked] = React.useState(isOpen);

	useEffect(() => {
		setChecked(isOpen);
	}, [isOpen]);

	const handleChange = (event) => {
		setChecked(event.target.checked);
		handlePermissionChange(id, event.target.checked);
	};

	return (
		<div className='flex flex-col items-start w-1/2 my-3 mx-6'>
			<div className='flex items-center w-full'>
				<p className='flex-grow flew-shrink font-semibold text-Primary text-[14px]'>
					{title}
				</p>
				<DarkSwitch
					className='flex-grow-0 flew-shrink'
					checked={true}
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

export default AddRole;
