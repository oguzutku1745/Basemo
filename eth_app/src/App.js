import React, {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import Appage from './pages/Appage/Appage';
import Home from './pages/Home/Home';
import Botpage from './pages/Botpage/Botpage';
import ProtectedRoutes from './pages/Appage/Protectedroute';
import { AuthContext } from './utils/AuthContext';



function App() {
  const [allowed, setAllowed] = useState(false);

  return (
    
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="app" element={<Appage />} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<Botpage/>} path="botpage" component={Botpage} />
            
          </Route>
    </Routes>
    
  )
}



export default App;