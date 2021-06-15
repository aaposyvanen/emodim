import { combineReducers } from "redux";
import rawDataReducer from "./reducers/rawDataReducer";
import threadReducer from "./reducers/threadReducer";
import responseReducer from "./reducers/responseReducer";

const createRootReducer = combineReducers({
    rawDataReducer,
    threadReducer,
    responseReducer
});

export default createRootReducer;
