import React, { useEffect, useState } from 'react';
import assets from '../../assets';
import axios from 'axios';
import './LoginSignUp.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PageIllustration from './PageIllustration.jsx';
import PasswordReset from './PasswordReset.tsx';
type Props = {};

const LoginSignUp = (props: Props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [isLogButtonDisabled, setIsLogButtonDisabled] = useState(false);
  const [isRegButtonDisabled, setIsRegButtonDisabled] = useState(true);
  const [action, setAction] = useState('Sign Up');
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('');
  
  useEffect(() => {
    const verify = async () => {
      const key = searchParams.get('key');
      if (key) {
        const response = await axios({
          method: 'GET',
          url: 'http://localhost:5000/verify-email?key=' + key,
          withCredentials: true,
        });
        alert(response.data.message);
        navigate('/', { replace: true });
      }
    };
    verify();
    if (
      action === 'Sign Up' &&
      email &&
      password &&
      username &&
      email.endsWith('@esi-sba.dz') // Check if email ends with @esi-sba.dz
    ) {
      setIsLogButtonDisabled(false);
      setIsRegButtonDisabled(false);
    } else if (action === 'Sign Up' && (!email || !password || !username)) {
      setIsLogButtonDisabled(false);
      setIsRegButtonDisabled(false);
    } else if (action === 'Log In' && email && password) {
      setIsRegButtonDisabled(false);
      setIsLogButtonDisabled(false);
    } else if (action === 'Log In' && (!email || !password)) {
      setIsRegButtonDisabled(false);
      setIsLogButtonDisabled(true);
    }
  }, [email, username, password, action]);
  
  const [open, setOpen] = React.useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  
  const handleClose = () => setOpen(false);
  
  const handleLogin = async () => {
    try {
      console.log(email, password);
      const response = await axios.post('/login', { email, password });
      console.warn(response);
      
      if (!response.data.isCompleted) {
        navigate("/SignUpSuite");
      } else {
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      alert('Login failed: Invalid email or password');
      console.error('Login failed:', error);
      // Handle login failure
    }
  };
  
  const handleResetClick = () => {
    setResetPassword(true);
  };
  
  const handleLoginClick = () => {
    if (action === 'Log In') {
      handleLogin();
    } else {
      setAction('Log In');
    }
  };

  const handleGoBack = () => {
    setResetPassword(false);
  };
  
  const handleRegisterClick = () => {
    if (action === 'Sign Up') {
      handleRegister();
    } else {
      setAction('Sign Up');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('/sign-up', { username, email, password, userType: "consommateur" });
      if (response.data.userId) {
        setOpen(true);
        setRegistrationSuccess(true);
        setRegistrationMessage(
          'Registration successful! You will receive an email to verify your account.'
        );
        setUsername('');
        setPassword('');
        navigate('/verify-email', { replace: true });
      } else {
        setRegistrationMessage(
          'User already registered! Please log in, or wait for Admin confirmation'
        );
        setUsername('');
        setPassword('');
      }

      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration failure
    }
  };

  return (
    <>
      {!resetPassword && (
        <div className="flex flex-col min-h-screen overflow-hidden antialiased bg-gray-900 text-gray-200 tracking-tight">
          <main className="grow">
            {/* Page illustration */}
            <div className="relative max-w-6xl mx-auto h-0 pointer-events-none" aria-hidden="true">
              <PageIllustration />
            </div>
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md">
                <div className="container mr-2">
                  <div className="header">
                    <div className="text text-center"> {action} </div>
                    <div className="underline"></div>
                  </div>
                  <div className="inputs space-y-4">
                    {action === 'Log In' ? (
                      <div></div>
                    ) : (
                      <div className="input flex items-center space-x-2">
                        <img src={assets.image.person} alt="" />
                        <input
                          type="username"
                          placeholder="Full Name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded"
                        />
                      </div>
                    )}
                    <div className="input flex items-center space-x-2">
                      <img src={assets.image.email} alt="" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded"
                      />
                    </div>
                    <div className="input flex items-center space-x-2">
                      <img src={assets.image.password} alt="" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded"
                      />
                    </div>
                  </div>
                  {action === 'Sign Up' ? (
                    <div></div>
                  ) : (
                    <div className="forgot-password mt-4 text-center">
                      Lost Password? <span onClick={handleResetClick} className="text-blue-500 cursor-pointer">Click Here!</span>
                    </div>
                  )}
                </div>
                <div className="submit-container mt-6 flex justify-between space-x-2">
                  <button
                    className={`flex-grow p-2 rounded ${action === 'Sign Up' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                    onClick={handleRegisterClick}
                    disabled={isRegButtonDisabled}
                  >
                    Sign Up
                  </button>
                  <button
                    className={`flex-grow p-2 rounded ${action === 'Sign Up' ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
                    onClick={handleLoginClick}
                    disabled={isLogButtonDisabled}
                  >
                    Log In
                  </button>
                </div>
              </div>
              {registrationMessage && (
                <div className={`mt-4 text-center ${registrationSuccess ? 'text-green-500' : 'text-red-500'}`}>
                  {registrationMessage}
                </div>
              )}
            </div>
          </main>
        </div>
      )}
      {resetPassword && <PasswordReset goBack={handleGoBack} />}
    </>
  );
};

export default LoginSignUp;
