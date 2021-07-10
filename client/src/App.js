import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import axios from 'axios';

import Nav from './components/Nav/Nav';
import Home from './components/Home/Home';
import Read from './components/Read/Read';
import Share from './components/Share/Share';
import Profile from './components/Profile/Profile';
import Login from './components/Auth/Login/Login';
import Signup from './components/Auth/Signup/Signup';
import setAuthToken from './utils/setAuthToken';
import { authActions } from './store/auth';
import './App.css';

function App() {

  const dispatch = useDispatch();
  const tokenState = useSelector(state => state.auth.token);

  // Load user 
  const loadUser = async() => {
      if (localStorage.token) {
          setAuthToken(localStorage.token);
      }
      try {
          const res = await axios.get('/api/auth');
          dispatch(authActions.loadUser(res.data));
      } catch (error) {
          dispatch(authActions.noAuth());
          // console.error('Failed to load user');
      }
  }

  // User needs to be loaded everytime the page changes
  useEffect(() => {
    // Only load user if token is detected
    tokenState && loadUser();
  }, []);


  return (
      <Router>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/reading">
              <Read />
            </Route>
            <Route exact path="/share">
              <Share />
            </Route>
            {/* if not logged in don't allow access to Profile */}
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/login">
              <Login loadUser={loadUser} />
            </Route>
            <Route exact path="/signup">
              <Signup loadUser={loadUser} />
            </Route>

          </Switch>
        </div>
      </Router>

    
  );
}

export default App;
