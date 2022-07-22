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

            // TODO this block of code is done in a function in analysisHelper.js (getSentenceValencePredictions and getWordLevelAnalysis)
            // and should be tidied to utilize the ready functionality
                const res = await axios.post(`${analysisEndpoint}/evaluateSentence/`, {
                    instances: state.responseReducer.responseText
                });
                // Attempting to fetch valence predictions for the message directly from Tensorflow serving
                const regex = /(?<=[.!?])\s/;
                let sentences = state.responseReducer.responseText.split(regex);
                const encoded = await axios.post("http://python-backend:5000/tokenize/", {
                    instances: sentences,
                });
                console.log(encoded);
                const resValence = await axios.post("http://localhost:8501/v1/models/fine_tuned_finBERT:predict", {
                    signature_name: "serving_default",
                    instances: encoded
                });
                console.log(resValence);
                dispatch(updateAnalysisData({"words" : res.data[0], "sentenceValencePredictions" :resValence['data']['predictions']}));
            // end TODO clean up lines 32-45
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
