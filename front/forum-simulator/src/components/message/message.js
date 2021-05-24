import React from "react";
import _ from "lodash";

import "./message.css";
const Message = ({ data }) => {

    if (data && data.commentMetadata) {

        const {
            author,
            datetime
        } = data.commentMetadata;

        const words = data.words;
        const message = _.map(words, wordData => {
            if (_.includes([",", ".", "...", ":"], wordData.word)) {
                return wordData.word;
            }
            return " " + wordData.word;
        });

        return (
            <div className="message-box">
                <div className="metadata">
                    <div className="author">
                        {author}
                    </div>
                    <div className="date">
                        {datetime}
                    </div>
                </div>
                <div className="message">
                    {message}
                </div>
            </div>
        );
    }
    return null;

}

export default Message;
