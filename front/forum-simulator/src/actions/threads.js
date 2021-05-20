export const UPDATE_AVAILABLE_THREADS = "UPDATE_AVAILABLE_THREADS";
export const UPDATE_CURRENT_THREAD = "UPDATE_CURRENT_THREAD";

export const updateAvailableThreads = allThreads => ({
    type: UPDATE_AVAILABLE_THREADS,
    payload: allThreads
});

export const updateCurrentThread = newThread => ({
    type: UPDATE_CURRENT_THREAD,
    payload: newThread
});
