export const UPDATE_RAW_THREAD_DATA = "UPDATE_RAW_THREAD_DATA";
export const UPDATE_CURRENT_INDEX = "UPDATE_CURRENT_INDEX";

export const updateAvailableRawThreads = allThreads => ({
    type: UPDATE_RAW_THREAD_DATA,
    payload: allThreads
});

export const updateCurrentIndex = newIndex => ({
    type: UPDATE_CURRENT_INDEX,
    payload: newIndex
});
