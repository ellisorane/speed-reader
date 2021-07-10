import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";

import classes from './Home.module.css';

import { readingActions } from '../../store/reading';


const Input = () => {

    const text = useSelector(state => state.reading.text);
    const title = useSelector(state => state.reading.title);
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
                <p>Speed reader is an experimental reading application that is supposed to help increase the user's reading speed.</p>
                <h3>Instructions: </h3>
                <ul>
                    <li>Copy text into the text area, select the reading speed and hit the "Start Reading" button.</li>
                    <li>Once you get to the reading page you can use on screen buttons to navigate the text.</li>
                    <li>Alternatively you can use the arrow keys and Enter button for text navigation as well.</li>
                </ul>
                
            </div>

            <div className={classes.copyTextArea}>
                
                <h2>{title ? title : 'Paste copied text here'}</h2>
                <textarea name="" className={classes.copyText} onChange={addTextHandler} rows="20" value={text}></textarea>
                <br />
                <select onChange={setreadingSpeedHandler} className={classes.readingSpeed}>
                    <option value="250">240 wpm - Novice</option>
                    <option value="166">400 wpm - Expert</option>
                    <option value="62">1000 wpm - Reading God</option>
                </select>
                <br />
                <NavLink className={classes.btn} exact to={isThereText ? "/reading" : "/"} onClick={textSubmittedHandler}>Start Reading</NavLink>
                <button className={classes.btn} onClick={() => dispatch(readingActions.clearAllText())}>Clear All Text</button>
            </div>
        </main>
    );
}

export default Input;