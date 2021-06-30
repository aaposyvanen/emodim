import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateMessageText } from "../../actions/responseActions";
import "./responseField.css";
import AnalysisReport from "../analysisReport/analysisReport";

const ResponseField = () => {

    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(updateMessageText(event.target.value));
    };

    const responseText = useSelector(state => state.responseReducer.responseText);

    return (
        <div className="response-field">
            <textarea
                type="text"
                className="response-text-input"
                placeholder="Write an answer..."
                maxLength={500}
                onChange={(event) => handleChange(event)}
                value={responseText}
            >
            </textarea>
            <AnalysisReport />
        </div>
    );
}

export default ResponseField;
