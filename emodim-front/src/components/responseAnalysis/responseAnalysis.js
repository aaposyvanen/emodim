import React from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import ResponseField from "../responseField/responseField";
import AnnotatedWord from "../annotatedWord/annotatedWord";
import { messageFeedbackStrings as feedback } from "../../constants";
import "./responseAnalysis.css";

const ResponseAnalysis = ({ analysisResults, valenceResults, annotations }) => {

    // TODO: FIX THIS MESS (utilize annotatedMessage, should provide ready, well-formed valence prediction strings)
    const results = useSelector(state => state.responseReducer.valenceResults);
    let analysisMessage = null;
    let messageValence = 0;
    const sentenceValences = {
        negative: 0,
        neutral: 0,
        positive: 0
    }

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
        if (results) {
            const messagePredictions = results;
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

    const message = _.map(analysisResults, (wordData, index) => {
        return <AnnotatedWord key={index} wordData={wordData} highlights={annotations} />
    });
    return (
        <div className="response-analysis">
                <div className={`analysis-message message-valence${messageValence}`}>
                    {analysisMessage}
                </div>
                <div className="original-response">
                    {message}
                </div>
            <ResponseField />
        </div>
    )
}

export default ResponseAnalysis;
