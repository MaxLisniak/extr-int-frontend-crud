import React, { useEffect, useState, useContext  } from "react";
import AuthContext from "../context/AuthProvider";
import axios from '../api/axios';
import { useNavigate } from "react-router";


export default function SignInScreen(props){

    const { setAuth } = useContext(AuthContext);
    const [username,  setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    // clear errors when user unputs are changed
    useEffect(() => {
        setErrors([]);
    }, [username, password])
    
    // handle sign in
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios(
                '/users/signin', 
                {
                    method: "post",
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    data: {username, password},
                }
            );
            const accessToken = response.data.accessToken;
            const userId = response.data.userId;
            // add received user data to context
            setAuth({ username, userId, accessToken });
            setErrors([]);
            // clear user inputs
            setUsername("");
            setPassword("");
            navigate("/");
        } catch(error){
            console.error(error);
            if (!error?.response?.data){
                setErrors(["No server response", ...errors]);
            } else {
                const errorList = error.response.data.errors;
                if (errorList.length > 0){
                    setErrors([...errors, ...errorList.map(errorObj => errorObj.msg)]);
                } else {
                    setErrors(["Signing in failed", ...errors]);
                }
            }
        }
    }

    return (
        <div className="auth-form-container">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit} className="form auth-form">
            <label htmlFor="username">Username</label>     
            <input 
                type="text" 
                placeholder="Enter username" 
                id="username"
                className="form-element-blue"
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
}