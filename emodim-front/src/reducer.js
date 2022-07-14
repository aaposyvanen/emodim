import { combineReducers } from "redux";
import rawDataReducer from "./reducers/rawDataReducer";
import threadReducer from "./reducers/threadReducer";
import responseReducer from "./reducers/responseReducer";
import userReducer from "./reducers/userReducer";
import annotationsReducer from "./reducers/annotationsReducer";
import newsReducer from "./reducers/newsReducer";
import { END_TEST } from "./actions/endActions";

const appReducer = combineReducers({
    rawDataReducer,
    threadReducer,
    responseReducer,
    userReducer,
    annotationsReducer,
    newsReducer,
});

const createRootReducer = (state, action) => {
    if (action.type === END_TEST) {
        return appReducer(undefined, action);
    }
     return appReducer(state, action);
}

export default createRootReducer;
