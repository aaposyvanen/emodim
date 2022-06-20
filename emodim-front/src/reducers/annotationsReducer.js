import { UPDATE_ANNOTATIONS } from "../actions/annotationActions";

const initialState = {
    annotations: {
        message: {
            messageAnalysis: false,
            emoji: false,
            sidebar: false,
            sentenceHighlighs: false,
            wordHighlights: false,
        },
        feedback: {
            messageAnalysis: false,
            emoji: false,
            sidebar: false,
            sentenceHighlighs: false,
            wordHighlights: false,
        },
        sentiment: {
            positive: false,
            negative: false,
            neutral: false,
        }
    }
};

const annotationsReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case UPDATE_ANNOTATIONS:
            return {
                ...state,
                annotations: actions.payload
            };
        default:
            return state;
    }
}

export default annotationsReducer;