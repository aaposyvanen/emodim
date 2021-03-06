import React from "react";

import "./annotatedWord.css";

const AnnotatedWord = ({ wordData, highlights, selectedSentiments }) => {

    let renderedWord = null;
    const { arousal, valence } = wordData;
    let valenceClass = 0;
    let arousalClass = 0;
    let wordTooltip = null;


    if (highlights) {
        if (valence < -0.75 && selectedSentiments.negative) {
            valenceClass = -2;
        } else if (valence < -0.6 && selectedSentiments.negative) {
            valenceClass = -1;
        } else if (valence > 0.6 && valence < 0.75 && selectedSentiments.positive) {
            valenceClass = 1;
        } else if (valence > 0.75 && selectedSentiments.positive) {
            valenceClass = 2;
        }

        if (arousal > 0.75) {
            arousalClass = 2;
        } else if (arousal > 0.5) {
            arousalClass = 1;
        }

        if (valenceClass === -2 || valenceClass === 2) {
            wordTooltip = "Tästä sanasta tunnistettiin vahvoja tunteita."
        }
    }

    switch (wordData.type) {
        case "WORD":
            renderedWord =
                <span
                    className={`word arousal${arousalClass} valence${valenceClass}`}
                    title={wordTooltip}
                >
                    {wordData.word}
                </span>
            break;
        case "WHITESPACE":
            renderedWord = <span className="whitespace"> </span>;
            break;
        case "PUNCTUATION":
            renderedWord = <span className="punctuation">{wordData.word}</span>
            break;
        case "UNKNOWN":
            if (wordData.word.endsWith("\\n")) {
                renderedWord = <div className="line-break">{"\n"}</div>;
            }
            break;
        default:
            break;
    }
    return renderedWord;
}

export default AnnotatedWord;
