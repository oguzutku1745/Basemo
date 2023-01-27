import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, whitelisted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (whitelisted) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/" />;
        }
      }}
    />
  );
};

export default ProtectedRoute;