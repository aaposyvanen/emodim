import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateMessageText } from "../../actions/responseActions";
import "./responseField.css";
import AnalysisReport from "../analysisReport/analysisReport";

const ResponseField = () => {

    const dispatch = useDispatch()
    const handleChange = (event) => {
        dispatch(updateMessageText(event.target.value));
    }

    const messageText = useSelector(state => state.responseReducer.messageText);

    return (
        <div className="response-field">
            <textarea
                type="text"
                className="response-text-input"
                placeholder="Vastaa..."
                maxLength={500}
                onChange={(event) => handleChange(event)}
                value={messageText}
            >
            </textarea>
            <AnalysisReport />
        </div>
    );
}

export default ResponseField;
