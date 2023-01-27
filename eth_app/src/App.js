import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Appage from './pages/Appage/Appage';
import Home from './pages/Home/Home';
import Botpage from './pages/Botpage/Botpage';


function App() {
  
  return (
    
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="app" element={<Appage />} />
    </Routes>
    
  )
}



export default App;