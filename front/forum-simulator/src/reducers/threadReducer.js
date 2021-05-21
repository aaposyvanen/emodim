import _ from "lodash";

import {
    UPDATE_AVAILABLE_THREADS,
    UPDATE_CURRENT_THREAD
} from "../actions/threadActions";

const initialState = {
    availableThreads: [],
    currentThread: {
        threadID: "",
        startMessage: {},
        comments: [],
        metadata: {}
    }
};

const threadReducer = (state = initialState, action) => {

    switch (action.type) {
        case UPDATE_AVAILABLE_THREADS:
            return {
                ...state,
                availableThreads: action.payload
            };
        case UPDATE_CURRENT_THREAD:

            const {
                threadID,
                comments,
                threadMetadata
            } = action.payload;

            const startMessage = comments[0];

            return {
                ...state,
                currentThread: {
                    threadID,
                    startMessage,
                    comments: _.drop(comments, 1),
                    metadata: threadMetadata
                }
            };
        default:
            return state;
    }
}

export default threadReducer;
