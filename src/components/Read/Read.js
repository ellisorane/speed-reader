import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FaPause } from 'react-icons/fa';
import { FaPlay } from 'react-icons/fa';
import { FaBackward } from 'react-icons/fa';
import { FaForward } from 'react-icons/fa';

import classes from './Read.module.css';

import { readingActions } from '../../store/reading';

const Read = () => {

    const textArray = useSelector(state => state.reading.textArray);
    const readingSpeed = useSelector(state => state.reading.readingSpeed);
    const wordIndex = useSelector(state => state.reading.wordIndex);

    const dispatch = useDispatch();

    const [status, setStatus] = useState('paused');
    const [display, setDisplay] = useState('');
    const [timer, setTimer] = useState(null);

    
    const playBtnHandler = () => {
        setStatus('play');

            console.log('Loop should be running.');
        
            setTimer(setInterval(() => {
                
                if (wordIndex <= textArray.length) {
                    dispatch(readingActions.increment());
                    console.log("wordIndex: " + wordIndex);
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
            console.log("wordIndex: " + wordIndex);

        }
    }   

    const forwardHandler = () => {
        if (wordIndex < textArray.length) {

            setDisplay(textArray[wordIndex]);
            dispatch(readingActions.increment());
            console.log("wordIndex: " + wordIndex);

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
        
    }, [status, timer])

    return (
        <main className={classes.readContainer}>
            <div>
                <h1>{ display }</h1>
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
        </main>
    );
}

export default Read;