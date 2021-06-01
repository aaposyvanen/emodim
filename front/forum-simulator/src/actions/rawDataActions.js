export const UPDATE_RAW_THREAD_DATA = "UPDATE_RAW_THREAD_DATA";
export const UPDATE_CURRENT_RAW_THREAD = "UPDATE_CURRENT_RAW_THREAD";
export const UPDATE_CURRENT_RAW_THREAD_INDEX = "UPDATE_CURRENT_RAW_THREAD_INDEX";

export const updateAvailableRawThreads = allThreads => ({
    type: UPDATE_RAW_THREAD_DATA,
    payload: allThreads
});

export const updateCurrentRawThread = newThread => ({
    type: UPDATE_CURRENT_RAW_THREAD,
    payload: newThread
});

export const updateCurrentRawThreadIndex = newIndex => ({
    type: UPDATE_CURRENT_RAW_THREAD_INDEX,
    payload: newIndex
});
