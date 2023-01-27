import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


const Homepage = () => {
  return (
    <div className="homepage d-flex align-items-center justify-content-center">
      <div className="btn-container d-flex align-items-center justify-content-center">
        <Link to="/app" className="btn-orange">Launch App</Link>
        <h1 className="brand-name text-white">Basemo</h1>
      </div>
    </div>
  );
}

export default Homepage;