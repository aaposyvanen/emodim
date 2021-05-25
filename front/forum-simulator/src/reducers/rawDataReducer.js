import _ from "lodash";

import {
    UPDATE_RAW_THREAD_DATA,
    UPDATE_CURRENT_RAW_THREAD
} from "../actions/rawDataActions";

const initialState = {
    availableThreads: [],
    currentThread: {
        threadID: "",
        startMessage: {},
        comments: [],
        metadata: {}
    }
};

const rawDataReducer = (state = initialState, action) => {

    switch (action.type) {
        case UPDATE_RAW_THREAD_DATA:
            return {
                ...state,
                availableThreads: action.payload
            };
        case UPDATE_CURRENT_RAW_THREAD:

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

export default rawDataReducer;
