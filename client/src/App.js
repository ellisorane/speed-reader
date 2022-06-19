import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import axios from 'axios';

import Nav from './components/Nav/Nav';
import setAuthToken from './utils/setAuthToken';
import { authActions } from './store/auth';

import Spinner from './components/Spinner/Spinner';

import './App.css';

const Home = React.lazy(() => import('./components/Home/Home'));
const Read = React.lazy(() => import('./components/Read/Read'));
const Share = React.lazy(() => import('./components/Share/Share'));
const Profile = React.lazy(() => import('./components/Profile/Profile'));
const Login = React.lazy(() => import('./components/Auth/Login/Login'));
const Signup = React.lazy(() => import('./components/Auth/Signup/Signup'));

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

  // Show default user avatar if the uploaded one cannot be found
  const defaultAvatar = ({currentTarget}) => {
    currentTarget.onerror = null; // prevents looping
    currentTarget.src="/uploads/default.jpg";
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
            {/* <Route exact path="/">
              <React.Suspense fallback={<Spinner />}><Home /></React.Suspense>
            </Route>
            <Route exact path="/reading">
              <React.Suspense fallback={<Spinner />}><Read /></React.Suspense>
            </Route>
            <Route exact path="/share">
              <React.Suspense fallback={<Spinner />}><Share defaultAvatar={ defaultAvatar } /></React.Suspense>
            </Route>
            if not logged in don't allow access to Profile
            <Route exact path="/profile">
              <React.Suspense fallback={<Spinner />}><Profile defaultAvatar={ defaultAvatar } loadUser={ loadUser } /></React.Suspense>
            </Route>
            <Route exact path="/login">
              <React.Suspense fallback={<Spinner />}><Login loadUser={loadUser} /></React.Suspense>
            </Route>
            <Route exact path="/signup">
              <React.Suspense fallback={<Spinner />}><Signup loadUser={loadUser} /></React.Suspense>
            </Route> */}

            <React.Suspense fallback={<Spinner />}>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/reading">
                <Read />
              </Route>
              <Route exact path="/share">
                <Share defaultAvatar={ defaultAvatar } />
              </Route>
              {/* if not logged in don't allow access to Profile */}
              <Route exact path="/profile">
                <Profile defaultAvatar={ defaultAvatar } loadUser={ loadUser } />
              </Route>
              <Route exact path="/login">
                <Login loadUser={loadUser} />
              </Route>
              <Route exact path="/signup">
                <Signup loadUser={loadUser} />
              </Route>
            </React.Suspense>

          </Switch>
        </div>

      </Router>

    
  );
}

export default App;
