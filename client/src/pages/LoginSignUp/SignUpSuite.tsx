

import React, { useState } from 'react';
import PageIllustration from './PageIllustration.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


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

const SignUpSuite = () => {
    const navigate = useNavigate();
    const [matricule, setMatricule] = useState('');
    const [address, setAddress] = useState('');
    const [telephone, setPhone] = useState('');
    const [institution, setInstitution] = useState('ESI-SBA');
    const [userType, setUserType] = useState('Consumer');
    const [service, setService] = useState('Administration');

 
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (userType === 'Consumer') {
            if (matricule && address && telephone && institution) {
                try {
                    const response = await axios({
                        method: 'POST',
                        url: 'http://localhost:5000/complete-profile',
                        data: {
                            matricule,
                            address,
                            telephone,
                            service,
                            userType: 'consommateur',
                        },
                        withCredentials: true,
                    });
                    alert('Consumer successfully registered!');
                    navigate('/');
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert('Please fill in all fields!');
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen overflow-hidden antialiased bg-gray-900 text-gray-200 tracking-tight">
            <main className="grow">
                {/* Page illustration */}
                <div className="relative max-w-6xl mx-auto h-0 pointer-events-none" aria-hidden="true">
                    <PageIllustration />
                </div>

                <section className="relative">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="pt-16 pb-12 md:pt-32 md:pb-20">
                            {/* Page header */}
                            <div className="max-w-4xl mx-auto text-center pb-6 md:pb-6">
                                <h1 className="h1">Complete your information</h1>
                                <p className="text-xl text-gray-400 mb-2">
                                    You are almost there, just complete your information to access your account.
                                </p>
                            </div>

                            {/* Form */}
                            <div className="max-w-sm mx-auto">
                                <form>
                                    <div className="flex flex-wrap -mx-3 mb-4">
                                        <div className="w-full px-3">
                                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="matricule">
                                                Matricule <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                value={matricule}
                                                onChange={(e) => setMatricule(e.target.value)}
                                                id="matricule"
                                                type="text"
                                                className="form-input w-full text-gray-800"
                                                placeholder="Ex: 380526525"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-4">
                                        <div className="w-full px-3">
                                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="phone">
                                                Phone Number <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                value={telephone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                id="phone"
                                                type="text"
                                                className="form-input w-full text-gray-800"
                                                placeholder="+213 6 00 00 00 00"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-4">
                                        <div className="w-full px-3">
                                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="institution">
                                                Institution <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                value={institution}
                                                disabled={true}
                                                id="institution"
                                                type="text"
                                                className="form-input w-full text-gray-800"
                                                placeholder="Institution"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-4">
                                        <div className="w-full px-3">
                                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="address">
                                                Address <span className="text-red-600">*</span>
                                            </label>
                                            <input
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                id="address"
                                                type="text"
                                                className="form-input w-full text-gray-800"
                                                placeholder="Address"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-4">
                                        <div className="w-full px-3">
                                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="service">
                                                Service <span className="text-red-600">*</span>
                                            </label>
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
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full px-3">
                                            <button
                                                type="submit"
                                                className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                                                onClick={handleSignUp}
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SignUpSuite;
