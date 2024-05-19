import React, { useEffect, useState } from 'react';
import assets from '../../assets';
import axios from 'axios';
import './LoginSignUp.css';
import { useNavigate,useSearchParams } from 'react-router-dom';
import VerificationModal from './VerificationModal.tsx';
import PageIllustration from './PageIllustration.jsx';
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
  const [role,setRole] = useState('');
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
				navigate('/SignUpSuite', { replace: true });
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
      setIsRegButtonDisabled(false  );
    } else if (action === 'Log In' && email && password) {
      setIsRegButtonDisabled(false);
      setIsLogButtonDisabled(false);
    } else if (action === 'Log In' && (!email || !password)) {
      setIsRegButtonDisabled(false);
      setIsLogButtonDisabled(true);
    }
  }, [email, username, password, action]);
  const [open, setOpen] = React.useState(false);
	const handleClose = () => setOpen(false);
  const handleLogin = async () => {
    try {
      console.log(email, password);
      const response = await axios.post('/login', { email, password });
      if(response.data.isCompleted){
      navigate("/SignUpSuite");

      }else{
          navigate("/");
          window.location.reload();
      }
          

    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure
    }
  };

  const handleLoginClick = () => {
    if (action === 'Log In') {
      handleLogin();
    } else {
      setAction('Log In');
    }
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
      // Check if email ends with @esi-sba.dz
      /*if (!email.endsWith('@esi-sba.dz')) {
        setRegistrationMessage('Please use a valid @esi-sba.dz email address.');
        return;
      }*/
      const response = await axios.post('/sign-up', { username, email, password ,userType:"administrator"});
      if (response.data.userId) {
        setOpen(true);
        setRegistrationSuccess(true);
        setRegistrationMessage(
          'Registration successful! You will receive an email to verify your accounr.'
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
         <div className="flex flex-col min-h-screen overflow-hidden antialiased bg-gray-900 text-gray-200 tracking-tight">
            <main className="grow">
                {/* Page illustration */}
                <div className="relative max-w-6xl mx-auto h-0 pointer-events-none" aria-hidden="true">
                    <PageIllustration />
                </div>
    <div>
      <div>
        <div className="container">
          <div className="header">
            <div className="text"> {action} </div>
            <div className="underline"></div>
          </div>
          <div className="inputs">
            {action === 'Log In' ? (
              <div></div>
            ) : (
              <div className="input">
                <img src={assets.image.person} alt="" />
                <input
                  type="username"
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="input">
              <img src={assets.image.email} alt="" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input">
              <img src={assets.image.password} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {action === 'Sign Up' ? (
            <div></div>
          ) : (
            <div className="forgot-password">
              Lost Password ? <span>Click Here !</span>
            </div>
          )}
        </div>
        <div className="submit-container">
          <button
            className={action === 'Sign Up' ? 'submit' : 'submit gray'}
            onClick={handleRegisterClick}
            disabled={isRegButtonDisabled}
          >
            Sign Up
          </button>
          <button
            className={action === 'Sign Up' ? 'submit gray' : 'submit'}
            onClick={handleLoginClick}
            disabled={isLogButtonDisabled}
          >
            Log in
          </button>
        </div>
      </div>
      {registrationMessage && (
        <div className={`registration-message ${registrationSuccess ? 'success' : 'error'}`}>
          {registrationMessage}
        </div>
      )}
    </div>
 
    </main>
        </div>
    </>
  );
};

export default LoginSignUp;
