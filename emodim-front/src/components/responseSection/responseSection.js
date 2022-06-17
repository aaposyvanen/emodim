import React, { useState } from "react";
import ResponseAnalysisDialog from "../responseAnalysisDialog/responseAnalysisDialog";
import ResponseField from "../responseField/responseField";

const ResponseSection = ({ toggleResponsefield, commentId }) => {
    const [input, setInput] = useState('');

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const clearResponseField = () => {
        setInput('');
    }

    return (
        <div className="response-section">
            <ResponseField 
                input={input}
                handleChange={handleChange}
            />
            <ResponseAnalysisDialog 
                inputText={input}
                clearResponseField={clearResponseField}
                toggleResponsefield={toggleResponsefield}
                parentId={commentId}
            />
        </div>
    )
}

export default ResponseSection;