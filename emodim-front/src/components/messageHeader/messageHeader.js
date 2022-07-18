import React from "react";

import EmojiAnnotation from "../emojiAnnotation/emojiAnnotation";

import "./messageHeader.css";

const MessageHeader = ({ author, messageLevelAnnotations, analysisMessage, messageValence, emoji }) => {
    return (
        <div className="message-header">
            <div className="author">{author}</div>
            <div className="analysis">
                {
                    messageLevelAnnotations &&
                    <div className={`analysis-message message-valence${messageValence}`}>
                        {analysisMessage}
                    </div>
                }
                {
                    emoji &&
                    <EmojiAnnotation
                        messageValence={messageValence}
                    />
                }
            </div>
        </div>    
    );
}
 
export default MessageHeader;