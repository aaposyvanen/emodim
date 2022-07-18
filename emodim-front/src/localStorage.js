/**
 * Gets state from sessionsStorage.
 * @returns {state|undefined} Returns undefined if getItem fails or nothing is saved.
 */
export const loadState = () => {
    try {
        const serializedState = sessionStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

/**
 * Saves state to sessionStorage.
 * @param {object} state 
 */
export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem('state', serializedState);
    } catch (err) {
        console.log('error:', err);
    }
};