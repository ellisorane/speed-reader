import { createSlice } from '@reduxjs/toolkit';

const initialReadingState = {
    text: "Dolphins are regarded as the friendliest creatures in the sea and stories of them helping drowning sailors have been common since Roman times. The more we learn about dolphins, the more we realize that their society is more complex than people previously imagined. They look after other dolphins when they are ill, care for pregnant mothers and protect the weakest in the community, as we do. Some scientists have suggested that dolphins have a language but it is much more probable that they communicate with each other without needing words. Could any of these mammals be more intelligent than man? Certainly the most common argument in favor of man's superiority over them that we can kill them more easily than they can kill us is the least satisfactory. On the contrary, the more we discover about these remarkable creatures, the less we appear superior when we destroy them.",
    textArray: [],
    readingSpeed: 555,
    isThereText: true,
    textSubmitted: false,
    wordIndex: 0
}

const readingSlice = createSlice({
    name: 'reading',
    initialState: initialReadingState,
    reducers: {
        addText(state, action) {
            state.text = action.payload;
            state.isThereText = true;
            
            if (state.text === '') {
                state.textSubmitted = false;
            }

        },
        setreadingSpeed(state, action) {
            state.readingSpeed = action.payload;
        },
        submitted(state) {
            state.textSubmitted = true;
            
            if (state.isThereText === true) {
                state.textArray = [];
                ((state.text).split(" ")).forEach(word => {
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
        zero(state) {
            state.wordIndex = 0;
        }
        

    }
});

export default readingSlice.reducer;

export const readingActions = readingSlice.actions;