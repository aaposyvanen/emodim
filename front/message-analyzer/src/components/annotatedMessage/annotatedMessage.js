import React from "react";
import _ from "lodash";
import AnnotatedWord from "../annotatedWord/annotatedWord";
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
                <div className="message" key={data.commentMetadata.id}>
                    {message}
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
