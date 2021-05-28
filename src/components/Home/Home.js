import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";

import classes from './Home.module.css';

import { readingActions } from '../../store/reading';


const Input = () => {

    const text = useSelector(state => state.reading.text);
    const isThereText = useSelector(state => state.reading.isThereText);

    const dispatch = useDispatch();

    const addTextHandler = (event) => {
        const addedText  = event.target.value;
        dispatch(readingActions.addText(addedText));
    }

    const setreadingSpeedHandler = (event) => {
        const speed = event.target.value;
        dispatch(readingActions.setreadingSpeed(speed));
        // console.log(readingSpeed);
    }

    const textSubmittedHandler = () => {
        dispatch(readingActions.submitted());
    }

    // Reset readingSpeed to 555 upon visiting the home page
    useEffect(() => {
        dispatch(readingActions.setreadingSpeed(555));
    })

    return (
        <main>
            <div className={classes.container}>
                
                <h2 className={classes.containerHeading}>What is Speed Reader?</h2>
                
                <hr />
                <p>Speed reader is an experimental reading application that is supposed to help increase the user's reading speed.
                    Just copy text into the text area, select the reading speed and hit the start/play button.</p>
            </div>

            <div className={classes.copyTextArea}>
                
                <h2>Paste copied text here</h2>
                <textarea name="" className={classes.copyText} onChange={addTextHandler} rows="20" value={text}></textarea>
                <br />
                <select onChange={setreadingSpeedHandler} className={classes.readingSpeed}>
                    <option value="555">110 wpm - Beginner</option>
                    <option value="250">240 wpm - Novice</option>
                    <option value="166">400 wpm - Expert</option>
                    <option value="62">1000 wpm - Reading God</option>
                </select>
                <br />
                <NavLink className={classes.startReading} exact to={isThereText ? "/reading" : "/"} onClick={textSubmittedHandler}>Start Reading</NavLink>

            </div>
        </main>
    );
}

export default Input;