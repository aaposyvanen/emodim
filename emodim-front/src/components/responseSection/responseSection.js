import React, { useState } from "react";

import { useSelector } from "react-redux";

import ResponseAnalysisDialog from "../responseAnalysisDialog/responseAnalysisDialog";
import ResponseField from "../responseField/responseField";
import { responseSection } from "../../constants";

const ResponseSection = ({ toggleResponsefield, commentId }) => {
    const [input, setInput] = useState('');
    
    const user = useSelector(state => state.userReducer.username);

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const clearResponseField = () => {
        setInput('');
    }

    return (
        <div className="response-section">
            <p>{responseSection.userText} <strong>{user}</strong></p>
            <ResponseField 
                input={input}
                handleChange={handleChange}
                parentId={commentId}
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