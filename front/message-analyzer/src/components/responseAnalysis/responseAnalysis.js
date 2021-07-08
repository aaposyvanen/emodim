import React from "react";
import _ from "lodash";
import ResponseField from "../responseField/responseField";
import AnnotatedWord from "../annotatedWord/annotatedWord";
import "./responseAnalysis.css";

const ResponseAnalysis = ({ analysisResults }) => {

    const message = _.map(analysisResults, (wordData, index) => {
        console.log(wordData)
        return <AnnotatedWord key={index} wordData={wordData} />
    });
    return (
        <div className="response-analysis">
            <div>
                {message}
            </div>
            <ResponseField />
        </div>
    )
}

export default ResponseAnalysis;
