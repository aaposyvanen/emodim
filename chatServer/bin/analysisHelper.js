const axios = require("axios");
const _ = require("lodash");

async function getWordLevelAnalysis(message) {
    try {
        const res = await axios.get(`http://host.docker.internal:5000/evaluateSentence/${message}`);
        return res.data[0];
    } catch (error) {
        console.log("Word analysis server didn't respond.");
    }
}

async function getSentenceValencePredictions(message) {

    const sentences = splitMessageToSentences(message);
    try {
        const res = await axios.post("http://sentence-analyzer:8501/v1/models/rnnmodel:predict", {
            signature_name: "serving_default",
            instances: sentences
        });
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

    // The prediction service requires input as an array of arrays,
    // each of the inner arrays containing an individual sentence.
    const sentenceArrays = _.map(sentences, sentence => {
        return [sentence];
    });
    return sentenceArrays;
}

module.exports = {
    getWordLevelAnalysis,
    getSentenceValencePredictions
}
