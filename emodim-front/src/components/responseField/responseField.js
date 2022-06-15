import React from "react";
import { responseFieldPlaceHolder } from "../../constants";
import "./responseField.css";

const ResponseField = ({ input, handleChange }) => {
    return (
        <div className="response-field">
            <textarea
                type="text"
                className="response-text-input"
                placeholder={responseFieldPlaceHolder}
                maxLength={500}
                onChange={(event) => handleChange(event)}
                value={input}
            />
        </div>
    );
}

export default ResponseField;
