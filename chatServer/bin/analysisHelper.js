const axios = require("axios");
const _ = require("lodash");

async function getWordLevelAnalysis(message) {
    try {
        const res = await axios.post("http://word-analysis:5000/evaluateSentence/", {
            instances: message,
        });
        /*
        const res = await axios.post("http://localhost:5000/evaluateSentence/", {
            instances: message
        });
        */
        return res.data[0];
    } catch (error) {
        console.log(error);
        console.log("Word analysis server didn't respond, error above.");
    }
}

async function getSentenceValencePredictions(message) {

    const sentences = splitMessageToSentences(message);
    try {
        const res = await axios.post("http://sentence-analysis:8501/v1/models/rnnmodel:predict", {
            signature_name: "serving_default",
            instances: sentences
        });
        /*
        const res = await axios.post("http://localhost:8501/v1/models/rnnmodel:predict", {
            signature_name: "serving_default",
            instances: sentences
        });
        */
        return ("res", res.data.predictions);
    } catch (error) {
        console.log(error);
        console.log("Sentence analysis server didn't respond, error above.");
    }
}

function splitMessageToSentences(message) {

    // This regex finds the space between sentences (crudely)
    // "Match any whitespace that has one of [.!?] immediately before it."
    const regex = /(?<=[.!?])\s/;
    let sentences = message.split(regex);
    return sentences;
}

module.exports = {
    getWordLevelAnalysis,
    getSentenceValencePredictions
}
