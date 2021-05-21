import { combineReducers } from "redux";
import threadReducer from "./reducers/threadReducer";

const createRootReducer = combineReducers({
    threadReducer
});

export default createRootReducer;
