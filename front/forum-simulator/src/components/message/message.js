import React from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./message.css";
import "./annotationStyles2.css"

const Message = ({ data, response, styleWords = true }) => {

    if (data && data.commentMetadata) {

        const {
            author,
            datetime
        } = data.commentMetadata;

        const words = data.words;
        const message = _.map(words, (wordData, index) => {


            const valence = wordData.valence;
            const arousal = Math.abs(wordData.arousal);

            let valenceClass = 0,
                arousalClass = 0;

            if (styleWords) {

                if (valence < -0.75) {
                    valenceClass = -3;
                } else if (valence < -0.5) {
                    valenceClass = -2;
                } else if (valence < -0.25) {
                    valenceClass = -1;
                } else if (valence < 0.25) {
                    valenceClass = 0;
                } else if (valence < 0.5) {
                    valenceClass = 1;
                } else if (valence < 0.75) {
                    valenceClass = 2;
                } else if (valence <= 1) {
                    valenceClass = 3;
                } else {
                    valenceClass = 0;
                }

                if (arousal < 0.25) {
                    arousalClass = 0;
                } else if (arousal < 0.5) {
                    arousalClass = 1;
                } else if (arousal < 0.75) {
                    arousalClass = 2;
                } else if (arousal <= 1) {
                    arousalClass = 3;
                } else {
                    arousalClass = 0;
                }
            }

            let wordTooltip;

            if (valenceClass === -3 || valenceClass === 3) {
                wordTooltip = "Tästä sanasta tunnistettiin vahvoja tunteita."
            } else {
                wordTooltip = null;
            }

            const styledWord =
                <span
                    key={index}
                    title={wordTooltip}
                    className={`arousal${arousalClass} valence${valenceClass}`}>
                    {wordData.word}
                </span>
            const whitespace = <span> </span>
            if (!_.includes([",", ".", "..", "...", ":", "!", "?", "\"", "'"], wordData.word)) {
                return <span key={index} >{whitespace}{styledWord}</span>;
            }
            return styledWord;
        });

        const hasChildren = data.children && !_.isEmpty(data.children);
        let lowValenceCount = 0;
        let highValenceCount = 0;
        let messageValence;
        let iconTooltip;

        _.forEach(words, (word) => {
            if (word.valence < -0.25) {
                lowValenceCount++;
            } else if (word.valence > 0.25) {
                highValenceCount++;
            }
        });

        if (lowValenceCount / words.length > 0.05) {
            messageValence = -1;
            iconTooltip = "Tästä viestistä on tunnistettu tavallista negatiivisempia tunteita.";
        } else if (highValenceCount / words.length > 0.1) {
            messageValence = 1;
            iconTooltip = "Tästä viestistä on tunnistettu tavallista positiivisempia tunteita.";
        } else {
            messageValence = 0;
            iconTooltip = "Tästä viestistä ei ole tunnistettu tavallisesta poikkeavaa tunnesisältöä.";
        }

        return (
            <div className={`message-box${response ? " response" : ""}`}>
                <div className="metadata">
                    <div className="author">
                        {author}
                    </div>
                    <div className="date">
                        {datetime}
                    </div>
                </div>
                <div className="outer-content">
                    <div className="inner-content">
                        <div className="message" key={data.commentMetadata.id}>
                            {message}
                        </div>
                        <span className="icon" title={iconTooltip}>
                            <FontAwesomeIcon
                                className={`valence${messageValence}`}
                                icon={faCircle} />
                        </span>
                    </div>
                    {
                        hasChildren && data.children.map(child => {
                            return < Message
                                data={child}
                                key={child.commentMetadata.id}
                                response
                                styleWords={styleWords}
                            />
                        })
                    }
                </div>
            </div>
        );
    }
    return null;

}

export default Message;
