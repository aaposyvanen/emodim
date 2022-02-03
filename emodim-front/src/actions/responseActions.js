import axios from "axios";
import { analysisEndpoint } from "../constants";

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

            // Attempting to fetch valence predictions for the message directly from Tensorflow serving
            const regex = /(?<=[.!?])\s/;
            let sentences = state.responseReducer.responseText.split(regex);
            console.log(sentences);
            const resValence = await axios.post("http://localhost:8501/v1/models/rnnmodel:predict", {
                signature_name: "serving_default",
                instances: sentences
            });
            console.log(resValence.data.predictions);
            dispatch(updateAnalysisData({"words" : res.data[0], "sentenceValencePredictions" :resValence['data']['predictions']}));
           // dispatch(updateAnalysisData(resValence['data']['predictions']));
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
