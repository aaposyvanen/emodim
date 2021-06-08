export const UPDATE_THREAD_DATA = "UPDATE_THREAD_DATA";


export const updateCurrentThread = newThread => ({
    type: UPDATE_THREAD_DATA,
    payload: newThread
});
