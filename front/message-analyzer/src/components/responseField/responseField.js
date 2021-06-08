import React from "react";
import "./responseField.css";

const ResponseField = () => {
    return (
        <div className="response-field">
            <textarea
                type="text"
                className="response-text-input"
                placeholder="Vastaa..."
                maxLength={500}
            >

            </textarea>
            <button className="response-button">Lähetä</button>
        </div>
    );
}

export default ResponseField;
