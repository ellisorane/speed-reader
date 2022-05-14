import { createSlice } from '@reduxjs/toolkit';

const initialReadingState = {
    title: '',
    text: `Effective speed reading is a balance between pace and comprehension. Studies have found that the faster you read, the less information you take in, particularly when it comes to remembering detail.

            So, speed reading is clearly not the answer if you're reading a complex legal or technical document, even if you are pushed for time. Similarly, it would be sensible to slow down if the material you're reading is new or unfamiliar, or if you have to teach it to someone else.

            When you need to understand only the basic arguments or conclusions being presented, though, using a speed reading technique can work.

            This may especially be the case if you intend to go back and re-read something more slowly when you're less busy. In fact, one study has suggested that skimming a text can improve your comprehension the second time around.

            Generally speaking, if you want to memorize something, you'll need to read slowly, at less than 100 wpm. A normal rate for learning is 100-200 wpm, and for comprehension it is 200-400 wpm.

            Speed reading is normally done at a rate of around 400-700 wpm. Anything above 500-600 wpm means sacrificing comprehension, although this varies from person to person.`,
    textArray: [],
    error: '',
    readingSpeed: 500,
    isThereText: true,
    textSubmitted: false,
    wordIndex: 0,
    saved: false
}

const readingSlice = createSlice({
    name: 'reading',
    initialState: initialReadingState,
    reducers: {
        saveText(state) {
            state.saved = true
        },
        addText(state, action) {
            state.error = '';
            if (action.payload.content) {
                state.text = action.payload.content;
            } else {
                state.text = action.payload;
            }
            
            state.isThereText = true;
            state.wordIndex = 0;
            state.saved = false;

            if (action.payload.title) {
                state.title = action.payload.title;
                state.saved = true;
            }
            
            if (state.text === '') state.textSubmitted = false;

        },
        setreadingSpeed(state, action) {
            state.readingSpeed = action.payload;
        },
        submitted(state) {
            if (state.text === '') {
                state.textSubmitted = false;
                state.error = 'Cannot leave text area empty.';
            } else {
                state.textSubmitted = true;
            }
            
            if (state.isThereText === true) {
                state.textArray = [];
                ((state.text).split(/\s+/)).forEach(word => {
                    state.textArray.push(word);
                });
            }
        },
        increment(state) {
            state.wordIndex++;
        },
        decrement(state) {
            state.wordIndex--;
        },
        clearAllText(state) {
            state.text = '';
            state.isThereText = false;
        },
        zero(state) {
            state.wordIndex = 0;
        }

    }
});

export default readingSlice.reducer;

export const readingActions = readingSlice.actions;