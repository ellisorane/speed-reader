import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { AuthProvider } from './context/AuthContext';

import Nav from './components/Nav/Nav';
import Home from './components/Home/Home';
import Read from './components/Read/Read';
import Share from './components/Share/Share';
import Profile from './components/Profile/Profile';
import UpdateProfile from './components/Profile/UpdateProfile';
import Login from './components/Auth/Login/Login';
import Signup from './components/Auth/Signup/Signup';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';

import './App.css';

function App() {
  return (
    <AuthProvider>
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
            {/* if not logged in don't allow access to Profile and UpdateProfile  */}
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/update_profile">
              <UpdateProfile />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route exact path="/forgot_password">
              <ForgotPassword />
            </Route>

          </Switch>
        </div>
      </Router>
    </ AuthProvider>

    
  );
}

export default App;
