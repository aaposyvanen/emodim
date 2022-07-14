import React from "react";
import AnnotatedMessage from "../annotatedMessage/annotatedMessage";
import "./responseAnalysis.css";
import { useSelector } from "react-redux";
import { constructMessage } from "../../utils/messageUtils";

const ResponseAnalysis = ({ parentId, analysisResults }) => {
    const currentThread = useSelector(state => state.threadReducer.thread);
    const username = useSelector(state => state.userReducer.username);
    const results = useSelector(state => state.responseReducer.valenceResults);
    const currentAnnotations = useSelector(state => state.annotationsReducer.annotations.feedback);

    return (
        <div className="response-analysis">
            <AnnotatedMessage
                data={constructMessage(parentId, analysisResults, results, currentThread, username)}
                wordLevelAnnotations={currentAnnotations.wordHighlights}
                messageLevelAnnotations={currentAnnotations.messageAnalysis}
                emoji={currentAnnotations.emoji}
                sidebar={currentAnnotations.sidebar}
                response={true}
            />
        </div>
    )
}

export default ResponseAnalysis;