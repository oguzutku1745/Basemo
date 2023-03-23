import React, {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import Appage from './pages/Appage/Appage';
import Home from './pages/Home/Home';
import Botpage from './pages/Botpage/Botpage';
import ProtectedRoutes from './pages/Appage/Protectedroute';
import { AuthContext } from './utils/AuthContext';
import {ethers} from 'ethers';
import Profilepage from './pages/Profilepage/Profilepage';
import { TabProvider } from './pages/Tabcontext';



function App() {
  const [allowed, setAllowed] = useState(false);

  return (
    <TabProvider>
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="app" element={<Appage />} />
          
          <Route element={<ProtectedRoutes />}>
            <Route element={<Botpage/>} path="botpage" component={Botpage} />
            <Route element={<Profilepage />} path="profilepage" component={Profilepage} />
          </Route>
          
    </Routes>
    </TabProvider>
    
  )
}



export default App;