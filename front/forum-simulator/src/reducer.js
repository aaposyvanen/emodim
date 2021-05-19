import { combineReducers } from "redux";
import threadReducer from "./reducers/threads";

const createRootReducer = combineReducers({
    threadReducer
});

export default createRootReducer;
