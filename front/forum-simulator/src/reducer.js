import { combineReducers } from "redux";
import rawDataReducer from "./reducers/rawDataReducer";
import threadReducer from "./reducers/threadReducer";

const createRootReducer = combineReducers({
    rawDataReducer,
    threadReducer
});

export default createRootReducer;
