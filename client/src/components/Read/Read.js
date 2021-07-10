import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPause } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';
import { FaBackward } from 'react-icons/fa';
import { FaForward } from 'react-icons/fa';
import axios from 'axios';
import { Redirect } from 'react-router';

import classes from './Read.module.css';

// import { authActions } from '../../store/auth';
import { readingActions } from '../../store/reading';

const Read = () => {

    const loggedIn = useSelector(state => state.auth.loggedIn);
    const content = useSelector(state => state.reading.text);
    const textArray = useSelector(state => state.reading.textArray);
    const readingSpeed = useSelector(state => state.reading.readingSpeed);
    const wordIndex = useSelector(state => state.reading.wordIndex);
    const saved = useSelector(state => state.reading.saved);
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [textTitle, setTextTitle] = useState({
        title: ''
    })
    const { title } = textTitle;

    const dispatch = useDispatch();

    const [status, setStatus] = useState('paused');
    const [display, setDisplay] = useState('');
    const [timer, setTimer] = useState(null);

    const titleOnChangeHandler = (e) => setTextTitle({ ...textTitle, [e.target.name]: e.target.value });

    const saveTextHandler = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = JSON.stringify({ title, content });
        
        try {
            await axios.post('/api/texts', body, config);
            dispatch(readingActions.saveText());
            setShowSaveForm(false);
        } catch (err) {
            console.error(err);
        }
    }
    
    const playBtnHandler = () => {
        setStatus('play');

        setTimer(setInterval(() => {
                
            if (wordIndex <= textArray.length) {
                dispatch(readingActions.increment());
            }

        }, readingSpeed));

    }

    const pauseBtnHandler = () => {
        setStatus('paused');
    }

    const backwardHandler = () => {
        if (wordIndex >= 0) {
            
            setDisplay(textArray[wordIndex - 1]);
            dispatch(readingActions.decrement());

        }
    }

    const forwardHandler = () => {
        if (wordIndex < textArray.length) {

            setDisplay(textArray[wordIndex]);
            dispatch(readingActions.increment());

        }
    }

    const keyDownHandler = (e) => {
        const key = e.key;
        
        if (key === 'Enter') {
            if (status === 'paused') playBtnHandler();
            if (status === 'play') pauseBtnHandler()
        }

        if (status === 'paused') {
            
            if (key === 'ArrowLeft') backwardHandler();
    
            if (key === 'ArrowRight') forwardHandler();
    

        }
    }

    // Keyboard navigation 
    useEffect(() => {
        
        window.addEventListener('keydown', keyDownHandler);

        return () => {
            window.removeEventListener('keydown', keyDownHandler)
        }
    })

    useEffect(() => {

        setDisplay(textArray[wordIndex]);

        
        if (wordIndex > textArray.length) {
            
            setStatus('paused');
            dispatch(readingActions.zero());
            clearInterval(timer);
            // console.log("Stopped loop due to wordIndex being higher than array length.");
            
        }

    }, [dispatch, textArray, timer, wordIndex]);

    useEffect(() => {
        // If paused 
        if (status === 'paused') {
            
            setTimer(clearInterval(timer));
            // console.log("Stopped loop due to pause.");
            
        }

        // Pause application if user goes to another page
        return () => {
            if (window.location.href !== 'http://localhost:3000/reading') {
                setTimer(clearInterval(timer));
                // console.log("Stopped loop due to going to another page.");
            }
        }
        
    }, [status, timer]);

    if (!textArray || textArray.length < 1) {
        return <Redirect exact to="/" />
    }

    return (
        <main className={classes.readContainer}>
            <div>
                <h1>{display}</h1>
            </div>
            <div className={classes.textControls}>
                
                {/* only show the 'prev' and 'next' btns if paused */}

                {status === 'paused' ? <div className="prev"><FaBackward onClick={backwardHandler} /></div> : null}
                
                <div className="pausePlay">
                    {status === 'paused' && <FaPlay onClick={playBtnHandler} />}
                    {status === 'play' && < FaPause onClick={pauseBtnHandler} />}
                </div>

                {status === 'paused' ? <div className="next"><FaForward onClick={forwardHandler} /></div> : null}
                
            </div>

            {loggedIn && <button className={classes.saveBtn} onClick={() => setShowSaveForm(!showSaveForm)} disabled={saved}>{saved ? 'Saved' : 'Save text'}</button>}
            
            {showSaveForm && <form onSubmit={saveTextHandler} className={classes.saveTitle}>
                <input type="text" name="title" placeholder="Add a title" onChange={(e) => titleOnChangeHandler(e)} required/>
                <button type="submit" className={classes.saveBtn}>Save</button>
            </form>}
        </main>
    );
}

export default Read;