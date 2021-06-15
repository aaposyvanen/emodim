import axios from "axios";
import { analysisEndpoint } from "../constants";
import { parseAnalysisData } from "./helpers";

export const UPDATE_MESSAGE_TEXT = "UPDATE_MESSAGE_TEXT";
export const UPDATE_ANALYSIS_DATA = "UPDATE_ANALYSIS_DATA";
export const SEND_MESSAGE_FOR_ANALYSIS = "SEND_MESSAGE_FOR_ANALYSIS";
export const SET_WAITING_FOR_ANALYSIS = "SET_WAITING_FOR_ANALYSIS";

export const updateMessageText = text => ({
    type: UPDATE_MESSAGE_TEXT,
    payload: text
});

export const updateAnalysisData = analysisResults => ({
    type: UPDATE_MESSAGE_TEXT,
    payload: analysisResults
});

export const sendMessageForAnalysis = () => {

    return async (dispatch, getState) => {

        try {
            const state = getState();
            dispatch(setWaitingForAnalysis(true));
            const res = await axios({
                method: "post",
                url: analysisEndpoint,
                data: {
                    text: state.responseReducer.responseText
                }
            });
            dispatch(setWaitingForAnalysis(false));
            const analysisData = parseAnalysisData(res.data);
            dispatch(updateAnalysisData(analysisData))
        } catch (error) {
            dispatch(setWaitingForAnalysis(false));
            console.log(error)
        }
    }
}

export const setWaitingForAnalysis = isWaitingForAnalysis => ({
    type: SET_WAITING_FOR_ANALYSIS,
    payload: isWaitingForAnalysis
});
