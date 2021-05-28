import { useState } from 'react';
import { NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import classes from './Nav.module.css';

import { useAuth } from '../../context/AuthContext';

const Nav = () => {

    const [navOpen, setNavOpen] = useState(false);
    const [error, setError] = useState('');
    const textSubmitted = useSelector(state => state.reading.textSubmitted);
    const history = useHistory();

    const { loggedIn, logout } = useAuth();


    const handleNavOpen = () => {
        setNavOpen(!navOpen);
    }
    
    const logoutHandler = async() => {
        setError('');
        try {
            await logout();
            history.push('/login');
        } catch {
            setError('Failed to logout');
        }
    }

    return (
        <div className={classes.navWrapper}>
            <nav>
                <div className={classes.navBrand}>
                    <h4><i><NavLink className={classes.navBrand} exact to="/">Speed Reader</NavLink></i></h4>
                </div>
        
                <ul className={ navOpen ?  `${classes.navLinksUl} ${classes.navActive} ` : classes.navLinksUl }>
                    <li><NavLink className={classes.navLink} exact to="/" activeClassName={classes.activeLink}>Home</NavLink></li>
                    {/* Only show 'Reading...' if reading state is true */}
                    {textSubmitted && <li><NavLink className={classes.navLink} to="/reading" activeClassName={classes.activeLink}>Reading</NavLink></li>}
                    <li><NavLink className={classes.navLink} to={"/share"} activeClassName={classes.activeLink}>Share</NavLink></li>
                    { loggedIn && <li><NavLink className={classes.navLink} to={"/profile"} activeClassName={classes.activeLink}>Profile</NavLink></li> }

                    { !loggedIn ? <li><NavLink className={classes.navLink} to={"/login"} activeClassName={classes.activeLink}>Login</NavLink></li> :
                    <li className={classes.navLink} onClick={logoutHandler}>Logout</li> }
                </ul>
        
                <div className={classes.burger} onClick={handleNavOpen}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </nav>
        </div>
    );
}

export default Nav;