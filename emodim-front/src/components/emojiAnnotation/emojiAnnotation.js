import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngry, faLaugh, faMeh } from "@fortawesome/free-regular-svg-icons";
import "./emojiAnnotation.css"

const EmojiAnnotation = ({ messageValence }) => {

    let valenceEmoji;
    if (messageValence === 1) {
        valenceEmoji = faLaugh;
    } else if (messageValence === -1) {
        valenceEmoji = faAngry;
    } else {
        valenceEmoji = faMeh;
    }

    return (
        <div className="emoji-annotation">
            <FontAwesomeIcon
                icon={valenceEmoji}
                className={`valence-emoji message-valence${messageValence}`}
            />
        </div>
    )
}

export default EmojiAnnotation;
