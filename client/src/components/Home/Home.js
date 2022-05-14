import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";

import classes from './Home.module.css';

import { readingActions } from '../../store/reading';

/*

WPM calculation - milliseconds to wpm
500 milliseconds = 500/1000 = 0.50 sec
60 sec per minute
60/0.50 = 120 wpm


WPM calculation - wpm to milliseconds
120 wpm = 60/120 = 0.50 sec
0.50 * 1000 = 500 milliseconds

*/


const Input = () => {

    const text = useSelector(state => state.reading.text);
    const title = useSelector(state => state.reading.title);
    const isThereText = useSelector(state => state.reading.isThereText);
    const errorState = useSelector(state => state.reading.error);

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
        dispatch(readingActions.setreadingSpeed(500));
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
                    <li>Alternatively you can use the arrow and Enter keys for text navigation as well.</li>
                    <li>Create an account if you want to save your texts or leave comments.</li>
                </ul>
                
            </div>

            <div className={classes.copyTextArea}>
                
                <h2>{title ? title : 'Paste copied text here'}</h2>
                <p className={classes.error}>{errorState && errorState}</p>
                <textarea name="" className={classes.copyText} onChange={addTextHandler} rows="20" value={text}></textarea>
                <br />
                <select onChange={setreadingSpeedHandler} className={classes.readingSpeed}>
                    <option value={500}>120 wpm - Learning Lvl 1</option>
                    <option value={300}>200 wpm - Learning Lvl 2</option>
                    <option value={240}>250 wpm - Comprehension Lvl 1</option>
                    <option value={171}>350 wpm - Comprehension Lvl 2</option>
                    <option value={133}>450 wpm - Speed Reader Lvl 1</option>
                    <option value={105}>570 wpm - Speed Reader Lvl 2</option>
                    <option value={92}>650 wpm - Speed Reader Lvl 3</option>
                </select>
                <br />
                <NavLink className={classes.btn} exact to={isThereText ? "/reading" : "/"} onClick={textSubmittedHandler}>Start Reading</NavLink>
                <button className={classes.btn} onClick={() => dispatch(readingActions.clearAllText())}>Clear All Text</button>
            </div>
        </main>
    );
}

export default Input;