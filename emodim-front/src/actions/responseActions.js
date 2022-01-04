import axios from "axios";
import { analysisEndpoint, valenceAnalysisEndpoint } from "../constants";

export const UPDATE_MESSAGE_TEXT = "UPDATE_MESSAGE_TEXT";
export const UPDATE_ANALYSIS_DATA = "UPDATE_ANALYSIS_DATA";
export const SEND_MESSAGE_FOR_ANALYSIS = "SEND_MESSAGE_FOR_ANALYSIS";
export const SET_WAITING_FOR_ANALYSIS = "SET_WAITING_FOR_ANALYSIS";

export const updateMessageText = text => ({
    type: UPDATE_MESSAGE_TEXT,
    payload: text
});

export const updateAnalysisData = analysisResults => ({
    type: UPDATE_ANALYSIS_DATA,
    payload: analysisResults
});

export const sendMessageForAnalysis = () => {

    return async (dispatch, getState) => {

        try {
            const state = getState();
            if (!state.responseReducer.responseText) {
                throw new Error("No response to send");
            }

            dispatch(setWaitingForAnalysis(true));
            const res = await axios.post(`${analysisEndpoint}/evaluateSentence/`, {
                instances: state.responseReducer.responseText
            });
            const regex = /(?<=[.!?])\s/;
            let sentences = state.responseReducer.responseText.split(regex);
            const resValence = await axios.post(`${valenceAnalysisEndpoint}/v1/models/rnnmodel:predict/`, {
                instances: sentences
            });
            console.log(resValence);
            dispatch(updateAnalysisData(res.data[0]));
            dispatch(setWaitingForAnalysis(false));
        } catch (error) {
            dispatch(setWaitingForAnalysis(false));
            console.error(error)
        }
    }
}

export const setWaitingForAnalysis = isWaitingForAnalysis => ({
    type: SET_WAITING_FOR_ANALYSIS,
    payload: isWaitingForAnalysis
});
