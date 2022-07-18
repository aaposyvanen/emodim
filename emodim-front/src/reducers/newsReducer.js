import { UPDATE_NEWS_ARTICLE } from "../actions/newsActions";

const initialState = {
    article: {
        file: null,
        image: null,
    },
};

const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_NEWS_ARTICLE:
            return {
                ...state,
                article: action.payload
            };
        default:
            return state;
    }
}

export default newsReducer;