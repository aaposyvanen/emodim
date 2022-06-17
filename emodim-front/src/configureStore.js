import { applyMiddleware, createStore, compose } from "redux";
import { logger } from "redux-logger";
import thunk from "redux-thunk";
import { loadState, saveState } from "./localStorage";
import createRootReducer from "./reducer";
import throttle from 'lodash/throttle';

const middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
    middleware.push(logger);
}

const configureStore = () => {
    const persistedState = loadState();
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(createRootReducer, persistedState, composeEnhancers(
        applyMiddleware(...middleware)
    ));

    store.subscribe(throttle(() => {
        saveState({
            annotationsReducer: store.getState().annotationsReducer,
            });
    }, 1000));

    return store;
}

export default configureStore;
