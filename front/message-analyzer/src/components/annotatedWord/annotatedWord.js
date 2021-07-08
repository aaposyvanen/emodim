import React from "react";

const AnnotatedWord = ({ wordData }) => {

    let renderedWord = null;

    switch (wordData.type) {
        case "WORD":
            renderedWord =
                <span
                    className="word"
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
