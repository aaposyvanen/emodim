import React from "react";
import "./annotatedWord.css";

const AnnotatedWord = ({ wordData, annotations }) => {

    let renderedWord = null;
    const { arousal, valence } = wordData;
    let valenceClass = 0;
    let arousalClass = 0;


    if (annotations) {
        if (valence < -0.75) {
            valenceClass = -2;
        } else if (valence < -0.5) {
            valenceClass = -1;
        } else if (valence > 0.5 && valence < 0.75) {
            valenceClass = 1;
        } else if (valence > 0.75) {
            valenceClass = 2;
        }

        if (arousal > 0.75) {
            arousalClass = 2;
        } else if (arousal > 0.5) {
            arousalClass = 1;
        }
    }

    switch (wordData.type) {
        case "WORD":
            renderedWord =
                <span
                    className={`word arousal${arousalClass} valence${valenceClass}`}
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
