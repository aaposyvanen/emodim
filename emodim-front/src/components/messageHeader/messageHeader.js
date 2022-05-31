import React from "react";
import "./messageHeader.css";
import EmojiAnnotation from "../emojiAnnotation/emojiAnnotation";

const MessageHeader = ({ author, messageLevelAnnotations, analysisMessage, messageValence }) => {
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
                    messageLevelAnnotations &&
                    <EmojiAnnotation
                        messageValence={messageValence}
                    />
                }
            </div>
        </div>    
    );
}
 
export default MessageHeader;