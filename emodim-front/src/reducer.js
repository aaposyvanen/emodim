import { combineReducers } from "redux";
import rawDataReducer from "./reducers/rawDataReducer";
import threadReducer from "./reducers/threadReducer";
import responseReducer from "./reducers/responseReducer";
import userReducer from "./reducers/userReducer";
import annotationsReducer from "./reducers/annotationsReducer";
import newsReducer from "./reducers/newsReducer";

const createRootReducer = combineReducers({
    rawDataReducer,
    threadReducer,
    responseReducer,
    userReducer,
    annotationsReducer,
    newsReducer,
});

export default createRootReducer;
