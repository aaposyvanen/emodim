import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    updateMessageText,
    sendMessageForAnalysis
} from "../../actions/responseActions";
import "./responseField.css";

const ResponseField = () => {

    const dispatch = useDispatch()
    const handleChange = (event) => {
        dispatch(updateMessageText(event.target.value));
    }
    const sendResponse = () => {
        dispatch(sendMessageForAnalysis());
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
            <button
                className="response-button"
                onClick={() => sendResponse()}
            >
                Lähetä
            </button>
        </div>
    );
}

export default ResponseField;
