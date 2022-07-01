import React, { useEffect, useState } from "react";
import axios from '../api/axios';

export default function SignUpScreen(props){
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState(false);
    
    // clear errors when user unputs are changed
    useEffect(() => {
        setErrors([]);
    }, [username, password, confPassword])
    
    // handle sign up
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axios(
                '/users/signup', 
                {
                    method: "post",
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    data: {username, password, confPassword},
                }
            );
            setSuccess(true);
            setErrors([]);
            // clear user inputs
            setUsername("");
            setPassword("");
            setConfPassword("");
        } catch(error){
            console.error(error);
            setSuccess(false);
            if (!error?.response?.data){
                setErrors(["No server response", ...errors]);
            } else {
                const errorList = error.response.data.errors;
                if (errorList.length > 0){
                    setErrors([...errors, ...errorList.map(errorObj => errorObj.msg)]);
                } else {
                    setErrors(["Signing up failed", ...errors]);
                }
            }
        }
    }

    const successScreen = (
        <h1>Registration successul. Please <a href="/users/signin">sign in</a></h1>
    )

    return ( 
            success=== true ? successScreen : (
                <div className="auth-form-container">
                <h1>Sign up</h1>
                <form onSubmit={handleSubmit} className="form auth-form">
                    <label htmlFor="username">Username</label>     
                    <input 
                        type="text" 
                        placeholder="Enter username" 
                        id="username"
                        className="form-element-blue form-input"
                        onChange={(e)=>setUsername(e.target.value)}
                        value={username}
                        required
                    />
                    <label htmlFor="password">Password</label>   
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        id="password"
                        className="form-element-blue"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <label htmlFor="confPassword">Password Confirmation</label>
                    <input 
                        type="password" 
                        placeholder="Enter password confirmation" 
                        id="confPassword"
                        className="form-element-blue"
                        onChange={(e)=>setConfPassword(e.target.value)}
                        value={confPassword}
                        required
                    />
                    
                    {
                        errors.length > 0 ? 
                        (
                            <ul>
                            {
                                errors.map((error, i) => {
                                    return <li key={i} className="error-message"><p>{error}</p></li>
                                })
                            }
                            </ul>
                        )
                        : <></>
                    }
                    <input 
                        type="submit"
                        className="form-element-blue"
                    />                
                </form>
                </div>
            )
        
    )
}