import {
    UPDATE_MESSAGE_TEXT,
    UPDATE_ANALYSIS_DATA,
    SET_WAITING_FOR_ANALYSIS
} from "../actions/responseActions";

const initialState = {
    responseText: "",
    analysisResults: {},
    isWaitingForAnalysis: false
};

const responseReducer = (state = initialState, action) => {

    switch (action.type) {
        case UPDATE_MESSAGE_TEXT:
            return {
                ...state,
                responseText: action.payload
            }
        case UPDATE_ANALYSIS_DATA:
            return {
                ...state,
                analysisResults: action.payload
            }
        case SET_WAITING_FOR_ANALYSIS:
            return {
                ...state,
                isWaitingForAnalysis: action.payload
            }
        default:
            return state;
    }
}

export default responseReducer;
