import { applyMiddleware, createStore, compose } from "redux";
import { logger } from "redux-logger";
import thunk from "redux-thunk";
import createRootReducer from "./reducer"

const middleware = [logger, thunk];

const configureStore = () => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(createRootReducer, composeEnhancers(
        applyMiddleware(...middleware)
    ));

    return store;
}

export default configureStore;
