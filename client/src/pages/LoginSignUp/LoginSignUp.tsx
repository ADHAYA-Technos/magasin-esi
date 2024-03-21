import React, { useState } from 'react'
import assets from '../../assets';
import './LoginSignUp.css'
type Props = {}

const LoginSignUp = (props: Props) => {
    const [action,setAction] =useState("Sign Up");
  return (
    
        <div >
            <div className='container'>
            <div className="header">
                <div className="text"> {action} </div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action==="Log In"?<div></div> :<div className="input">
                    <img src={assets.image.person} alt =""/>
                    <input type="First Name" placeholder='First Name' />
                </div>}
            
                {action==="Log In"?<div></div> :<div className="input">
                    <img src={assets.image.person} alt =""/>
                    <input type="First Name" placeholder='First Name' />
                </div>}
                <div className="input">
                    <img src={assets.image.email} alt =""/>
                    <input type="email" placeholder='Email'/>
                </div>
                <div className="input">
                    <img src={assets.image.password} alt =""/>
                    <input type="password" placeholder='Password' />
                </div>
            </div>
        
            {action==="Sign Up"?<div></div> :<div className="forgot-password" >Lost Password ? <span>Click Here !</span></div>}
        </div>
        <div className="submit-container">
            <div className={action==="Sign Up"?"submit":"submit gray"} onClick={()=>{setAction("Sign Up")}} >Sign Up</div>
            <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Log In")} }>Log in</div>
        </div>
        </div>
        
      
  )
}

export default LoginSignUp