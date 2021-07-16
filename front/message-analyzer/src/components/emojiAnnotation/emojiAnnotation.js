import React from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngry, faLaugh, faMeh } from "@fortawesome/free-solid-svg-icons";
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
                className="valence-emoji"
            />
        </div>
    )
}

export default EmojiAnnotation;
