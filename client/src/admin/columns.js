import DeleteOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import UsersRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import axios from 'axios';
import { Link } from 'react-router-dom';

const handleDelete = async (id) => {
	await axios({
		method: 'DELETE',
		url: `http://localhost:5000/roles/${id}`,
		withCredentials: true,
	});
};

export const RoleColumns = [
	{ field: 'name', headerName: 'Rôles', width: 300 },
	{
		field: 'members',
		headerName: 'Membres',
		width: 300,
		renderCell: (params) => {
			return (
				<div className='flex flex-row items-center justify-start gap-4'>
					<UsersRoundedIcon className='text-[#727272]' />
					<p>{params.row.members}</p>
				</div>
			);
		},
	},
	{
		field: 'ations',
		headerName: 'Actions',
		width: 100,
		sortable: false,
		renderCell: (params) => {
			console.log(params);
			return (
				<div className='flex flex-row items-center gap-4'>
					<Link className='invisible' to='/role/createnewrole' state={params.row}>
						<EditOutlinedIcon />
					</Link>
					<DeleteOutlinedIcon
						onClick={() => handleDelete(params.row.id)}
						className='text-[#D11B2D] cursor-pointer'
					/>
				</div>
			);
		},
	},
];
