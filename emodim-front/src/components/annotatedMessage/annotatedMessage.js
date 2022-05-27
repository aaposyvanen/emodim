import React from "react";
import _ from "lodash";
import AnnotatedWord from "../annotatedWord/annotatedWord";
import EmojiAnnotation from "../emojiAnnotation/emojiAnnotation";
import "./annotatedMessage.css";

import { messageFeedbackStrings as feedback } from "../../constants";

const AnnotatedMessage = ({ data, wordLevelAnnotations, messageLevelAnnotations, response, isNew }) => {
    const { author } = data.commentMetadata;
    const words = data.words;
    const hasChildren = data.children && !_.isEmpty(data.children);

    let analysisMessage = null;
    let messageValence = 0;
    const sentenceValences = {
        negative: 0,
        neutral: 0,
        positive: 0
    }

    // Constructs an array of AnnotatedWords based on wordData to be rendered
    const message = _.map(words, (wordData, index) => {
        return <AnnotatedWord
            key={index}
            wordData={wordData}
            highlights={wordLevelAnnotations}
        />
    });

    // predictionArray has three floating point numbers, each representing
    // the certainty of the sentence belonging to that category
    // this function finds the index of the highest value
    // Example predictionArray: [0.2, 0.3, 0.5]
    const findHighestPredictionIndex = predictionArray => {

        let highestPrediction = 0;
        let indexOfHighestPrediction = -1;

        for (let i = 0; i < predictionArray.length; i++) {
            const roundedprediction = Math.round(predictionArray[i] * 100);
            if (roundedprediction > highestPrediction) {
                highestPrediction = roundedprediction;
                indexOfHighestPrediction = i;
            }
        }
        return indexOfHighestPrediction;
    }

    // increases the correct counter to keep track of how many sentences
    // have been found for each valence category
    const increaseValenceCounters = (index) => {
        if (index === 0) {
            sentenceValences.negative++;
        } else if (index === 1) {
            sentenceValences.neutral++;
        } else if (index === 2) {
            sentenceValences.positive++;
        }
    }

    // Goes through the prediction data of all of the sentences in a message and
    // increases the correct valence counter for each.
    const interpretValencePredictionData = () => {
        if (data.sentenceValencePredictions) {
            const messagePredictions = data.sentenceValencePredictions;
            for (let sentencePredictionArray of messagePredictions) {
                const indexOfHighestPrediction = findHighestPredictionIndex(sentencePredictionArray)
                increaseValenceCounters(indexOfHighestPrediction);
            }
        }
    }

    // sets analysisMessage and messageValence to their correct values so they
    // can be easily used in rendering
    const setFeedback = () => {
        messageValence = sentenceValences.positive - sentenceValences.negative;
        if (messageValence < 0) {
            analysisMessage = feedback.negative;
            messageValence = -1
        } else if (messageValence === 0) {
            analysisMessage = feedback.neutral;
        } else if (messageValence > 0) {
            analysisMessage = feedback.positive;
            messageValence = 1
        }
    }

    const handleValencePredictions = () => {
        interpretValencePredictionData();
        setFeedback()
    }

    handleValencePredictions()

    return (
        <div className={`message-box${response ? " response" : ""}`}>
            <div className="metadata">
                <div className="author">
                    {author}
                </div>
            </div>
            {
                messageLevelAnnotations &&
                <div className={`analysis-message message-valence${messageValence}`}>
                    {analysisMessage}
                </div>
            }
            <div className="content">
                <div className="message" key={data.commentMetadata.id}>
                    {message}
                </div>
                {
                    messageLevelAnnotations &&
                    <EmojiAnnotation
                        messageValence={messageValence}
                    />
                }
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
export default AnnotatedMessage;
