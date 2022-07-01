import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import {useContext} from 'react';
import MainScreen from './components/MainScreen';
import SignUpScreen from './components/SignUpScreen';
import SignInScreen from './components/SignInScreen';
import AuthContext from "./context/AuthProvider"
import axios from './api/axios';
import jwtDecode from 'jwt-decode';

function App() {
  
  const { setAuth, auth } = useContext(AuthContext);

  function handleSignOut(){
    axios(`http://localhost:3001/users/signout`,
    {
      method: "post",
      withCredentials: true
    })
    .then(res => {
      setAuth({});
      window.location.href = "/";
    }).catch(function (error) {
        console.log(error);
    })
  }

  return (
    <div className="App">
      <h1 id="brand">Stories</h1>
      <Router>
        <ul className='navbar'>
            <li><Link style={{ textDecoration: 'inherit'}} to="/"><p className='nav-link'>Home</p></Link></li>
            {auth.accessToken ? (
              <>
                <li><p>Signed in as <strong>{jwtDecode(auth.accessToken).username}</strong></p></li>
                <li><button className='nav-link' onClick={handleSignOut}>Sign Out</button></li>
              </>
            ) : (
              <>
                <li><Link style={{textDecoration: 'inherit'}} to="/users/signup"><p className='nav-link'>Sign Up</p></Link></li>
                <li><Link style={{textDecoration: 'inherit'}} to="/users/signin"><p className='nav-link'>Sign In</p></Link></li>
              </>
            )}
        </ul>
        <Routes>
          <Route exact path="/" element={<MainScreen />}/>
          <Route exact path="/users/signup" element={<SignUpScreen/>}/>
          <Route exact path="/users/signin" element={<SignInScreen/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
