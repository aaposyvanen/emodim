import { UPDATE_NEWS_ARTICLE, UPDATE_NEWS_IMAGE } from "../actions/newsActions";

const initialState = {
    article: null,
    image: null
};

const newsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_NEWS_ARTICLE:
            return {
                ...state,
                article: action.payload
            };
        case UPDATE_NEWS_IMAGE:
            return {
                ...state,
                image: action.payload
            }
        default:
            return state;
    }
}

export default newsReducer;