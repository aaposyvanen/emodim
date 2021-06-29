export const UPDATE_THREAD_DATA = "UPDATE_THREAD_DATA";
export const ADD_MESSAGE_TO_CURRENT_THREAD = "ADD_MESSAGE_TO_CURRENT_THREAD";

export const updateCurrentThread = newThread => ({
    type: UPDATE_THREAD_DATA,
    payload: newThread
});

export const addMessageToCurrentThread = newMessage => ({
    type: ADD_MESSAGE_TO_CURRENT_THREAD,
    payload: newMessage
});
