import React, { useEffect, useState } from 'react'
import assets from '../../assets';
import axios from 'axios';
import './LoginSignUp.css'
type Props = {}

const LoginSignUp = (props: Props) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [isLogButtonDisabled, setIsLogButtonDisabled] = useState(false);
    const [isRegButtonDisabled, setIsRegButtonDisabled] = useState(true);
   const [action,setAction] =useState("Sign Up");


    useEffect(() => {
      if (action === 'Sign Up' && email && password && username) {
        setIsLogButtonDisabled(false);
        setIsRegButtonDisabled(false);
      }else if (action === 'Sign Up' && (!email || !password || !username)) {
        setIsLogButtonDisabled(false);
        setIsRegButtonDisabled(true);
      } else if (action === 'Log In' && email && password) {
        setIsRegButtonDisabled(false);
        setIsLogButtonDisabled(false);
      } else if (action === 'Log In' && (!email || !password)){
        setIsRegButtonDisabled(false);
        setIsLogButtonDisabled(true);
   
      }
    }, [email, username, password, action]);
    
    const handleLogin = async () => {
        try {
            console.log(email, password);	
          const response = await axios.post('/login', { email, password });
          const isAdmin = response.data.isAdmin;
          if (isAdmin) {
            // Redirect to admin dashboard
            window.location.href = '/MainLayout';
          } else {
            window.location.href = '/';
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
            const response = await axios.post('/register', { username,email, password });
            // Handle registration success, e.g., show a message to the user
            if (response.data.success) {
                setRegistrationSuccess(true);
                setRegistrationMessage('Registration successful! You will receive an email when your account is approved.');
                setUsername('');
                setPassword('');
                window.location.href = '/emailConfirmation';
              } else {
                setRegistrationMessage('User already registered! Please log in , or wait for Admin confirmation');
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
    <div>
        <div >
            <div className='container'>
            <div className="header">
                <div className="text"> {action} </div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
               
            
                {action==="Log In"?<div></div> :<div className="input">
                    <img src={assets.image.person} alt =""/>
                    <input type="username" placeholder='Full Name' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>}
                <div className="input">
                    <img src={assets.image.email} alt =""/>
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="input">
                    <img src={assets.image.password} alt =""/>
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
            </div>
        
            {action==="Sign Up"?<div></div> :<div className="forgot-password" >Lost Password ? <span>Click Here !</span></div>}
        </div>
        <div className="submit-container">
            <button className={action==="Sign Up"?"submit":"submit gray"} onClick={handleRegisterClick} disabled={isRegButtonDisabled}>Sign Up</button>
            <button className={action==="Sign Up"?"submit gray":"submit"} onClick={handleLoginClick } disabled={isLogButtonDisabled}>Log in</button>
        </div>
        </div>
        {registrationMessage && (
        <div className={`registration-message ${registrationSuccess ? 'success' : 'error'}`}>
          {registrationMessage}
        </div>
      )}
        </div>
      
  )
}

export default LoginSignUp ;