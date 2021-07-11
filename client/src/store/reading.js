import { createSlice } from '@reduxjs/toolkit';

const initialReadingState = {
    title: '',
    text: "Dolphins are regarded as the friendliest creatures in the sea and stories of them helping drowning sailors have been common since Roman times. The more we learn about dolphins, the more we realize that their society is more complex than people previously imagined. They look after other dolphins when they are ill, care for pregnant mothers and protect the weakest in the community, as we do. Some scientists have suggested that dolphins have a language but it is much more probable that they communicate with each other without needing words. Could any of these mammals be more intelligent than man? Certainly the most common argument in favor of man's superiority over them that we can kill them more easily than they can kill us is the least satisfactory. On the contrary, the more we discover about these remarkable creatures, the less we appear superior when we destroy them.",
    textArray: [],
    error: '',
    readingSpeed: 250,
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