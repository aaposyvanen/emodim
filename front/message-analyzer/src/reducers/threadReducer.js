import {
    UPDATE_THREAD_DATA,
    ADD_MESSAGE_TO_CURRENT_THREAD
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
        case ADD_MESSAGE_TO_CURRENT_THREAD:
            return {
                ...state,
                thread: {
                    ...state.thread,
                    comments: [
                        action.payload,
                        ...state.thread.comments
                    ]
                }
            }
        default:
            return state;
    }
}

export default threadReducer;
