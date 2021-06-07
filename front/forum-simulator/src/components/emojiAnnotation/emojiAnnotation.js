import React from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngry, faLaugh, faCircle } from "@fortawesome/free-solid-svg-icons";
import "./emojiAnnotation.css"

const EmojiAnnotation = ({ positiveValence, valenceIntensity }) => {

    let valenceEmoji;
    if (positiveValence) {
        valenceEmoji = faLaugh;
    } else {
        valenceEmoji = faAngry;
    }

    const intensityCircles = _.map([1, 2, 3, 4, 5], (value) => {
        if (valenceIntensity >= value) {
            return (
                <FontAwesomeIcon
                    key={value}
                    icon={faCircle}
                    className="valence-circle-on"
                />
            );
        } else {
            return (
                <FontAwesomeIcon
                    key={value}
                    icon={faCircle}
                    className="valence-circle-off"
                />
            );
        }
    })

    return (
        <div className="emoji-annotation">
            <FontAwesomeIcon
                icon={valenceEmoji}
                className="valence-emoji"
            />
            <div className="valence-intensity">
                {intensityCircles}
            </div>
        </div>
    )
}

export default EmojiAnnotation;
