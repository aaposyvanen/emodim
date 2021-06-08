import {
    UPDATE_THREAD_DATA
} from "../actions/threadActions";

const initialState = {
    thread: {
        threadID: "",
        startMessage: {},
        comments: [],
        metadata: {}
    }
};

const threadReducer = (state = initialState, action) => {

    switch (action.type) {
        case UPDATE_THREAD_DATA:
            return {
                ...state,
                thread: action.payload
            };
        default:
            return state;
    }
}

export default threadReducer;
