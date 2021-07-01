import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, auth: { isAuth, loading }, ...rest }) => (
    <Route {...rest} render={props => !isAuth && !loading ? (<Redirect exact to='/' />) : (<Component { ...props } />) } />
)

export default PrivateRoute;
