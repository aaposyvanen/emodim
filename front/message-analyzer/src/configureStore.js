import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";
import createRootReducer from "./reducer"

const configureStore = () => {

    const store = createStore(createRootReducer, applyMiddleware(logger));

    return store;
}

export default configureStore;
