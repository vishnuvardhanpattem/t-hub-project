import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import "../css/Navbar.css"

const Navbar = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin'); // Redirect to sign-in after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar">
        <div className="navbar-list">
          <NavLink className="navbar-home" to="/">Mental Health</NavLink>
          <div className="navbar-items">
            <NavLink to="/signin" className='navbar-item'>SignIn</NavLink>
            <NavLink to="/signup" className='navbar-item'>SignUp</NavLink>
            <NavLink to="/logout" className='navbar-item'>Logout</NavLink>
          </div>
        </div>
      {/* </ul> */}
    </nav>
  );
};

export default Navbar;


