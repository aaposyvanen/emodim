import { UPDATE_AVAILABLE_THREADS, UPDATE_CURRENT_THREAD } from "../actions/threads";

const initialState = {
    availableThreads: [],
    currentThread: {}
};

const threadReducer = (state = initialState, action) => {

    switch (action.type) {
        case UPDATE_AVAILABLE_THREADS:
            return {
                ...state,
                availableThreads: action.payload
            };
        case UPDATE_CURRENT_THREAD:
            return {
                ...state,
                currentThread: action.payload
            };
        default:
            return state;
    }
}

export default threadReducer;
