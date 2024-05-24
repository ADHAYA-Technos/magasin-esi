import React, { useEffect } from 'react';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';


import { Button } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};


interface Props {
   
    goBack: () => void;
  };
const AddUser : React.FC<Props> = ({goBack }) => {
	//state for image
	const [file, setFile] = useState(null);
	const [showDropzone, setShowDropzone] = useState(true);
	const [roles, setRoles] = useState([]);
	useEffect(() => {
		const getRoles = async () => {
			const response = await axios({
				method: 'GET',
				url: 'http://localhost:5000/roles',
				withCredentials: true,
			});
			const roles = response.data.map((role) => role.name);
			setRoles(roles);
		};
		getRoles();
	}, []);

	const location = useLocation();
	const user = location?.state;
	const id = location?.state?.id;
	const [userData, setUserData] = useState(user || {});

    const services = [
        'Human Resources',
        'Administration',
        'Student Affairs',
        'Academic Affairs',
        'Financial Services',
        'IT Support',
        'Library Services',
        'Facilities Management',
        'Research and Development',
        'Alumni Relations',
        'Career Services',
        'Health and Wellness Services',
        'Admissions Office',
        'Registrar\'s Office',
        'Campus Security',
        'Marketing and Communications',
        'International Office',
        'Counseling Services',
        'Extracurricular Activities Coordination',
        'Community Engagement',
        'Procurement Services',
        'Legal Affairs',
        'Laboratories and Workshops Management',
        'Quality Assurance',
        'Faculty Support Services',
    ];
const [service,setService]=useState('Administration');
	const [matricule, setMatricule] = useState('');
	const [name, setName] = useState('');

	const [email, setEmail] = useState('');
	const [address, setAddress] = useState('');
	const [phone, setPhone] = useState('');
	const [institution, setInstitution] = useState('ESI-SBA');
	const [userType, setUserType] = useState('');
	const [password, setPassword] = useState('');



	const [userRoles, setUserRoles] = React.useState([]);

	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (user) {
			setUserData(user);
			setName(userData.name);
			setMatricule(userData.matricule);
			setEmail(userData.email);
			setPhone(userData.telephone);
			setAddress(userData.address);
			setInstitution(userData.institution);
			setUserType(userData.userType);
			
			setUserRoles(user.roles.map((role) => role.role));
		}
	}, [userData]);

	//useEffect(() => console.log(userRoles), [userRoles]);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
		setShowDropzone(false);
	};

	const handleReset = () => {
		setFile(null);
		setShowDropzone(true);
	};

	const handlePhoneChange = (event) => {
		const value = event.target.value;
		setPhone(value);
	};

	const [nameError, setNameError] = useState('');
	const [surnameError, setSurnameError] = useState('');

	const handleNameChange = (event) => {
		const value = event.target.value;
		const regex = /^[A-Za-z_]{1,50}$/;

		if (regex.test(value)) {
			setName(value);
			setNameError('');
		} else {
			setName('');
			setNameError('Format de prénom invalide');
		}
	};

	const handleMatriculeChange = (e) => {
		setMatricule(e.target.value);
	};


	const handleInstitutionChange = (e) => {
		setInstitution(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleAddressChange = (e) => {
		setAddress(e.target.value);
	};

	

	const handleTypeChange = (e) => {
		setUserType(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleUserRolesChange = (e) => {
		const {
			target: { value },
		} = e;
		setUserRoles(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value
		);
		//let blockRoles = roles.filter((role) => !e.target.value.includes(role));
		//console.log(blockRoles);
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios({
				method: 'PUT',
				url: 'http://localhost:5000/users/' + id,
				data: {
					name,
					matricule,
					telephone: phone,
					email,
					address,
					service,
					roles: userRoles,
				},
				withCredentials: true,
			});
			alert('User created/modified successfully');
			setUserData(response.data);
			
		} catch (err) {
			alert(err.response.data.message);
		}
	};
	const handleCreate = async (e) => {
        
		e.preventDefault();
		try {
			const response = await axios({
				method: 'POST',
				url: 'http://localhost:5000/users',
				data: {
					matricule,
					name,
					email,
					password,
					telephone: phone,
					service,
					userType: 'consommateur',
					roles: userRoles,
				},
				withCredentials: true,
			});
			setUserData(response.data);
		} catch (err) {
			alert(err.response.data.message);
		}
	};

	return (
		<div className='flex flex-col h-auto bg-white rounded-lg'>
			<div className='flex flex-col  basis-auto w-full '>
				<div className='flex flex-col mt-6 '>
					<div className='flex flex-row items-center '>
						<Button onClick={goBack}>
							<div className=' mx-5 px-4 py-1 bg-grey rounded-full cursor-pointer'>
								<KeyboardBackspaceRoundedIcon className='  cursor-pointer ' />{' '}
							</div>
						</Button>
						<div
							className='font-semibold text-#24272C'
							style={{ fontSize: '20px' }}>
							{id ? <p>Modifier le compte </p> : <p>Ajouter un utilisateur </p>}
						</div>
					</div>
					{id ? (
						<p
							className='text-#24272C font-light mt-4 mx-6 '
							style={{ fontSize: '15px' }}>
							{' '}
							Vous pouvez modifier le compte en changeant les informations dans
							le formulaire ci-dessous.
						</p>
					) : (
						<p
							className='text-#24272C font-light mt-4 mx-6 '
							style={{ fontSize: '15px' }}>
							{' '}
							Vous pouvez créer un nouveau compte en remplissant ce formulaire
							avec les informations appropriées.
						</p>
					)}
				</div>

				<div className='flex flex-row mt-4'>
					<form className=' px-10  py-5 w-3/5 flex-grow'>
						<div className='flex flex-row w-full mb-3 space-x-4'>
							<div className='w-1/2'>
								<label
									className=' font-semibold  block  text-#24272C    mb-1 mx-2'
									style={{ fontSize: '13px' }}
									htmlFor='grid-first-name'>
									Nom et Prénom <span className='text-[#FF0000]'>*</span>
								</label>
								
							<div className='w-1/2'>
								<input
									style={{ fontSize: '13px' }}
									className='appearance-none font-medium mt-6 w-full bg-gray-200 text-#24272C border border-gray-200 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
									id='grid-last-name'
									type='text'
									placeholder='Name'
									value={name}
									onChange={handleNameChange}
								/>
								{nameError && (
									<div style={{ color: 'red' }}>
										<p className='text-[12px]'>{nameError}</p>
									</div>
								)}
							</div>
                            </div>
						</div>
						<div className='flex flex-wrap -mx-3 mb-2'>
							<div className='w-full px-3 '>
								<label
									className=' font-semibold  block  text-#24272C text-xs  mb-1 mx-2'
									style={{ fontSize: '13px' }}
									htmlFor='grid-email'>
									Matricule <span className='text-[#FF0000]'>*</span>
								</label>
								<input
									style={{
										fontSize: '13px',
									}}
									className='appearance-none font-medium w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-lg  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
									id='matricule'
									type='text'
									value={matricule}
									onChange={handleMatriculeChange}
									placeholder='Entrez le matricule de cet utilisateur...'
								/>
							</div>
						</div>
						<div className='flex flex-wrap -mx-3 mb-2'>
							<div className='w-full px-3 '>
								<label
									className=' font-semibold  block  text-#24272C text-xs  mb-1 mx-2'
									style={{ fontSize: '13px' }}
									htmlFor='grid-email'>
									Adresse E-mail <span className='text-[#FF0000]'>*</span>
								</label>
								<input
									style={{
										fontSize: '13px',
									}}
									value={email}
									onChange={handleEmailChange}
									className='appearance-none font-medium w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-lg  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
									id='grid-email'
									type='email'
									placeholder="Entrez l'adresse e-mail..."
								/>
							</div>
						</div>
						{!user && (
							<div className='flex flex-wrap -mx-3 mb-2'>
								<div className='w-full px-3 '>
									<label
										className=' font-semibold  block  text-#24272C text-xs  mb-1 mx-2'
										style={{ fontSize: '13px' }}
										htmlFor='grid-email'>
										Mot de passe <span className='text-[#FF0000]'>*</span>
									</label>
									<input
										style={{
											fontSize: '13px',
										}}
										value={password}
										onChange={handlePasswordChange}
										className='appearance-none font-medium w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-lg  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
										id='grid-email'
										type='password'
										placeholder='Entrez le mot de passe...'
									/>
								</div>
							</div>
						)}
						<div className='flex flex-wrap mb-2'>
							<div className='w-full'>
								<label
									className=' font-semibold  block  text-#24272C text-xs  mb-1 mx-2'
									style={{ fontSize: '13px' }}
									htmlFor='grid-Telephone'>
									Téléphone <span className='text-[#FF0000]'>*</span>
								</label>
								<input
									style={{
										fontSize: '13px',
									}}
									className='appearance-none font-medium w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-lg mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
									id='grid-Telephone'
									type='tel'
									placeholder='Entrez le numéro de téléphone...'
									value={phone}
									onChange={handlePhoneChange}
								/>
								{errorMessage && (
									<div style={{ color: 'red' }}>
										<p className='text-[12px]'>{errorMessage}</p>
									</div>
								)}
							</div>
							
							<div className='flex flex-wrap w-full mb-1'>
								<div className='w-full'>
									<label
										className=' font-semibold  block  text-#24272C text-xs  mb-1 mx-2'
										style={{ fontSize: '13px' }}
                                        
										htmlFor='grid-email'>
										Institut <span className='text-[#FF0000]'>*</span>
									</label>
									<input
										style={{
											fontSize: '13px',
										}}
										className='appearance-none font-medium w-full bg-gray-200 text-gray-700 border border-gray-200 rounded-lg  mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
										id='matricule'
										type='text'
                                        disabled={true}
										value={institution}
										onChange={handleInstitutionChange}
										placeholder="Entrez l'institut de cet utilisateur..."
									/>
								</div>
							</div>

							{/*
								!user && (
									
									<div className='w-full md:w-1/3 md:mb-0'>
										<label
											className=' font-semibold  block  text-#24272C text-xs  mb-1 mx-2'
											style={{ fontSize: '13px' }}
											htmlFor='grid-type'>
											Type d'utilisateur{' '}
											<span className='text-[#FF0000]'>*</span>
										</label>
										<div className='relative'>
											<select
												style={{
													fontSize: '13px',
												}}
												value={userType}
												onChange={handleTypeChange}
												className='appearance-none font-medium w-full bg-gray-200 text-gray-500 border border-gray-200 rounded-lg mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
												id='grid-type'>
												<option className='text-#707070' value='consommateur'>
													Consommateur
												</option>
												<option className='text-#707070' value='magasiner'>
													Magasinier
												</option>
												<option className='text-#707070' value='director'>
													Director
												</option>
                                                <option className='text-#707070' value='asa'>
													ASA
												</option>
                                                <option className='text-#707070' value='rsa'>
													RSA
												</option>
                                                <option className='text-#707070' value='administrator'>
													Administrator
												</option>
											</select>
											<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
												<svg
													className='fill-current h-4 w-4'
													xmlns='http://www.w3.org/2000/svg'></svg>
											</div>
										</div>
									</div>
								)
								
                                            */}
						</div>

						<div>
							
							{userType === 'consommateur' ||userType === 'rsr'   && (
								<>
									<div className='flex flex-wrap -mx-3 mb-2'>
										<div className='w-full px-3 '>
											<label
												className=' font-semibold  block  text-#24272C text-xs  mb-1 mx-2'
												style={{ fontSize: '13px' }}
												htmlFor='grid-major'>
												Service <span className='text-[#FF0000]'>*</span>
											</label>
                                            <Select value={service}
                                                onChange={(e) => setService(e.target.value)}
                                                id="service"
                                                className="form-select w-full text-gray-800"
                                                required
                                            >
                                                {services.map((service) => (
                                                    <option key={service} value={service}>
                                                        {service}
                                                    </option>
                                                ))}
                                            </Select>
										</div>
									</div>
									
								</>
							)}
							
						</div>
						{id ? (
							<button
								onClick={handleEdit}
								className='flex items-center font-medium text-[13px] justify-center cursor-pointer h-8 bg-Primary border-[2px] border-Primary rounded-lg text-white my-3 py-4 px-4'>
								Enregistrer les modifications
							</button>
						) : (
							< button
                            style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
								onClick={handleCreate}
								className='flex items-center font-medium text-[13px] justify-center cursor-pointer h-8 bg-Primary border-[2px] border-Primary rounded-lg text-white my-3 py-4 px-4'>
								Créer le compte
							</button>
						)}
					</form>
					{/*** DropeZone file  ***/}

					<link
						rel='stylesheet'
						href='https://unpkg.com/flowbite@1.4.4/dist/flowbite.min.css'
					/>

					<div className='max-w-2xl w-2/5 mx-auto mt-10 flex-grow-0'>
						{showDropzone && (
							<div className='flex flex-col items-center justify-center w-full'>
								<div
									className='font-semibold block text-#24272C text-xs'
									style={{ fontSize: '16px' }}>
									<p>Photo de profile</p>
								</div>
								<div className='mt-6 w-full items-center justify-center flex'>
									<label
										htmlFor='dropzone-file'
										style={{
											borderRadius: '30%',
											width: '200px',
											height: '200px',
										}}
										className='flex flex-col items-center justify-center w-1156 h-1156 border-2 border-gray-700 border-dashed rounded-2xl cursor-pointer'>
										<div className='flex flex-col items-center justify-center pt-5 pb-6'>
											<NoteAddRoundedIcon className='w-10 h-10 rounded-xl border-gray-600 text-gray-600' />
											<p className='mb-1 mt-2 text-sm text-gray-500 dark:text-gray-600'>
												<span className='font-semibold'>
													Téléverser une image
												</span>{' '}
											</p>
											<p className='text-xs font-light text-gray-500 dark:text-gray-600'>
												SVG, PNG, JPG or GIF{' '}
											</p>
										</div>
										<input
											id='dropzone-file'
											type='file'
											className='hidden'
											onChange={handleFileChange}
										/>
									</label>
								</div>
							</div>
						)}
						{!showDropzone && (
							<div className='flex flex-col items-center justify-center w-full'>
								<img
									src={URL.createObjectURL(file)}
									alt='Uploaded'
									style={{
										objectFit: 'cover',
										borderRadius: '35%',
										width: '200px',
										height: '200px',
										marginTop: '6px',
									}}
								/>
								<button
									onClick={handleReset}
									className=' mt-4 font-medium bg-Primary rounded-lg px-4 py-2 text-white hover:bg-gray-600  '
									style={{
										fontSize: '13px',
									}}>
									Annuler
								</button>
							</div>
						)}
						<div className='w-full md:w-1/3 md:mb-0 items-center justify-center flex mt-10'>
							<div>
								<FormControl sx={{ m: 1, width: 300 }}>
									<InputLabel id='demo-multiple-checkbox-label'>
										Rôles
									</InputLabel>
									<Select
										labelId='demo-multiple-checkbox-label'
										id='demo-multiple-checkbox'
										multiple
										value={userRoles}
										onChange={handleUserRolesChange}
										input={<OutlinedInput label='Tag' />}
										renderValue={(selected) => selected.join(', ')}
										MenuProps={MenuProps}>
										{roles.map((name, index) => (
											<MenuItem key={index} value={name}>
												<Checkbox checked={userRoles.indexOf(name) > -1} />
												<ListItemText primary={name} />
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
                            
						</div>
                   
                        <div className='w-full md:w-1/3 md:mb-0 items-center justify-center flex mt-10'>
						{(userRoles.includes('consommateur') || userRoles.includes('rsr')) && (
    <>
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    id="service"
                    className="form-select w-full text-gray-800"
                    required
                >
                    {services.map((service) => (
                        <option key={service} value={service}>
                            {service}
                        </option>
                    ))}
                </select>
            </FormControl>
        </div>
    </>
)}
                            
						</div>

					</div>
				</div>
			</div>
		</div>
      
	);
};

export default AddUser;
