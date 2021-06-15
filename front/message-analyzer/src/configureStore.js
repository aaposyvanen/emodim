import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";
import thunk from "redux-thunk";
import createRootReducer from "./reducer"

const configureStore = () => {

    const store = createStore(createRootReducer, applyMiddleware(logger, thunk));

    return store;
}

export default configureStore;
