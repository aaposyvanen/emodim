import React from "react";
import _ from "lodash";
import AnnotatedWord from "../annotatedWord/annotatedWord";
import "./annotatedMessage.css";
import "../buttons.css";
import MessageHeader from "../messageHeader/messageHeader";
import ReplyArea from "../replyArea/replyArea";
import { useSelector } from "react-redux";

import { messageFeedbackStrings as feedback } from "../../constants";

const AnnotatedMessage = ({ data, wordLevelAnnotations, messageLevelAnnotations, response, emoji, sidebar, responseOpen, toggleResponsefield }) => {
    const selectedSentiments = useSelector(state => state.annotationsReducer.annotations.sentiment);
    const { author } = data.commentMetadata;
    const words = data.words;

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
            //console.log('roundedprediction', roundedprediction)
            // lasketaan vain jos certainty ylittää jonkin rajan? roundedprediction > 60 && ??
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
        if (messageValence < 0 && selectedSentiments.negative) {
            analysisMessage = feedback.negative;
            messageValence = -1;
        } else if (messageValence === 0 && selectedSentiments.neutral) {
            analysisMessage = feedback.neutral;
            messageValence = 0;
        } else if (messageValence > 0 && selectedSentiments.positive) {
            analysisMessage = feedback.positive;
            messageValence = 1;
        } else {
            analysisMessage = null;
            messageValence = -2;
        }
    }

    const handleValencePredictions = () => {
        interpretValencePredictionData();
        setFeedback()
    }

    handleValencePredictions()

    return (
        <div>
            <div className={`message-box${response ? " response" : ""} message-valence${messageValence} ${sidebar ? "sidebar" : ""}`}>
                <MessageHeader
                    author={author}
                    analysisMessage={analysisMessage}
                    messageLevelAnnotations={messageLevelAnnotations}
                    messageValence={messageValence}
                    emoji={emoji}
                />
                <div className="content">
                    <div className="message" key={data.commentMetadata.id}>
                        {message}
                    </div>
                </div>
                
                {!response
                    ? <ReplyArea
                            commentId={data.commentMetadata.comment_id}
                            responseOpen={responseOpen}
                            toggleResponsefield={toggleResponsefield}
                        />
                    : null}
            </div>
        </div>
    );
}
export default AnnotatedMessage;