import React, { useState } from 'react';
import PageIllustration from './PageIllustration.jsx';
import axios from 'axios';
import { useNavigate,useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const token = searchParams.get('token');

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Make a request to your backend to reset the password
            const response = await axios.post('http://localhost:5000/reset-password', {
                token: token,
                password,
            });
            alert('Password reset successfully');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error resetting password');
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
                                <h1 className="h1">Reset Password</h1>
                                <p className="text-xl text-gray-400 mb-2">
                                    Enter your new password.
                                </p>
                            </div>

                            {/* Form */}
                            <div className="max-w-sm mx-auto">
                                <form>
                                    <div className="flex flex-wrap -mx-3 mb-4">
                                        <div className="w-full px-3">
                                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">
                                                New Password
                                            </label>
                                            <input
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                id="password"
                                                type="password"
                                                className="form-input w-full text-gray-800"
                                                placeholder="Enter your new password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-4">
                                        <div className="w-full px-3">
                                            <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="confirmPassword">
                                                Confirm Password
                                            </label>
                                            <input
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                id="confirmPassword"
                                                type="password"
                                                className="form-input w-full text-gray-800"
                                                placeholder="Confirm your new password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full px-3">
                                            <button
                                                type="submit"
                                                className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                                                onClick={handleResetPassword}
                                            >
                                                Reset Password
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

export default ResetPassword;
