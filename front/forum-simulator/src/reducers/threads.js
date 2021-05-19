import { UPDATE_THREAD } from "../actions/threads";

const initialState = {
    currentThread: []
};

const threadReducer = (state = initialState, action) => {

    switch (action.type) {
        case UPDATE_THREAD:
            return {
                ...state,
                currentThread: action.payload
            };
        default:
            return state;
    }
}

export default threadReducer;
