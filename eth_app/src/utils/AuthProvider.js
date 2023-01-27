import React, { useState } from 'react';
import {AuthContext} from './AuthContext';

const AuthProvider = ({ children }) => {
  const [allowed, setAllowed] = useState(false);

  return (
    <AuthContext.Provider value={{ allowed, setAllowed }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;