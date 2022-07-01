import React from "react";
import { responseSection } from "../../constants";
import "./responseField.css";

const ResponseField = ({ input, handleChange, parentId }) => {
    const placeholder = parentId ? responseSection.placeholderReply : responseSection.placeholderComment;
    return (
        <div className="response-field">
            <textarea
                type="text"
                className="response-text-input"
                placeholder={placeholder}
                maxLength={500}
                onChange={(event) => handleChange(event)}
                value={input}
            />
        </div>
    );
}

export default ResponseField;