import {
    UPDATE_RAW_THREAD_DATA,
    UPDATE_CURRENT_RAW_THREAD,
    UPDATE_CURRENT_INDEX
} from "../actions/rawDataActions";

const initialState = {
    availableThreads: [],
    currentIndex: 0,
    currentThread: {
        threadID: "",
        startMessage: {},
        comments: [],
        metadata: {}
    },
    currentAnnotations: {
        message: {},
        feedback: {},
        sentiment: {}
    },
    currentNewsArticle: {}
};

const rawDataReducer = (state = initialState, action) => {

    switch (action.type) {
        case UPDATE_CURRENT_INDEX:
            return {
                ...state,
                currentIndex: action.payload
            };
        case UPDATE_RAW_THREAD_DATA:
            return {
                ...state,
                availableThreads: action.payload
            };
        case UPDATE_CURRENT_RAW_THREAD:

            const {
                threadID,
                comments,
                threadMetadata,
                annotations,
                newsArticle
            } = action.payload;

            const startMessage = comments[0];

            return {
                ...state,
                currentThread: {
                    threadID,
                    startMessage,
                    comments,
                    metadata: threadMetadata
                },
                currentAnnotations: annotations,
                currentNewsArticle: newsArticle
            };
        default:
            return state;
    }
}

export default rawDataReducer;
