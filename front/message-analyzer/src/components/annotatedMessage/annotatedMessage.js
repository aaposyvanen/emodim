import React from "react";
import _ from "lodash";
import AnnotatedWord from "../annotatedWord/annotatedWord";
import EmojiAnnotation from "../emojiAnnotation/emojiAnnotation";
import "./annotatedMessage.css";

const AnnotatedMessage = ({ data, response }) => {

    if (data && data.commentMetadata) {

        const {
            author,
            datetime
        } = data.commentMetadata;

        const words = data.words;
        const message = _.map(words, (wordData, index) => {
            return <AnnotatedWord key={index} wordData={wordData} annotations />
        });

        const hasChildren = data.children && !_.isEmpty(data.children);
        let lowValenceCount = 0;
        let highValenceCount = 0;
        let messageValence;
        let analysisMessage;

        for (const word of data.words) {
            if (word.valence > 0.75) {
                highValenceCount++;
            } else if (word.valence < -0.75) {
                lowValenceCount++;
            }
        }

        if (lowValenceCount / words.length > 0.05) {
            messageValence = -1;
            analysisMessage = "Tästä viestistä on tunnistettu negatiivisia tunteita.";
        } else if (highValenceCount / words.length > 0.1) {
            messageValence = 1;
            analysisMessage = "Tästä viestistä on tunnistettu positiivisia tunteita.";
        } else {
            messageValence = 0;
            analysisMessage = "Viestin tunnesisältö on neutraali.";
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
                <div className={`analysis-message message-valence${messageValence}`}>
                    {analysisMessage}
                </div>
                <div className="content">
                    <div className="message" key={data.commentMetadata.id}>
                        {message}
                    </div>
                    <EmojiAnnotation
                        messageValence={messageValence}
                    />
                </div>
                {
                    hasChildren && data.children.map(child => {
                        return < AnnotatedMessage
                            data={child}
                            key={child.commentMetadata.id}
                            response
                        />
                    })
                }
            </div>
        );
    }
    return null;

}

export default AnnotatedMessage;
