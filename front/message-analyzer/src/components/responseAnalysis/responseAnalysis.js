import React from "react";
import _ from "lodash";
import ResponseField from "../responseField/responseField";
import AnnotatedWord from "../annotatedWord/annotatedWord";
import "./responseAnalysis.css";
import { annotations } from "../../constants";

const ResponseAnalysis = ({ analysisResults }) => {

    const message = _.map(analysisResults, (wordData, index) => {
        return <AnnotatedWord key={index} wordData={wordData} annotations={annotations} />
    });
    return (
        <div className="response-analysis">
            <div className="original-response">
                {message}
            </div>
            <ResponseField />
        </div>
    )
}

export default ResponseAnalysis;
