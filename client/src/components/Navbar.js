import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Culinary Share
      </Link>

      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        
        {isAuthenticated ? (
          // Authenticated navigation
          <>
            <li>
              <Link to="/create-recipe">Create Recipe</Link>
            </li>
            <li>
              <Link to="/saved-recipes">Saved Recipes</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-light">
                Logout
              </button>
            </li>
            <li>
              <span>Welcome, {user && user.username}</span>
            </li>
          </>
        ) : (
          // Public navigation
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 