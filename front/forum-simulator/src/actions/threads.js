export const UPDATE_THREAD = "UPDATE_THREAD";

export const updateThread = newThread => ({
    type: UPDATE_THREAD,
    payload: newThread
});
