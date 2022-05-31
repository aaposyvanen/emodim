import React from "react";
import _ from "lodash";
import ResponseField from "../responseField/responseField";
import AnnotatedMessage from "../annotatedMessage/annotatedMessage";
import "./responseAnalysis.css";
import { useSelector } from "react-redux";
import * as dayjs from "dayjs";

const ResponseAnalysis = ({ analysisResults, annotations }) => {
    const currentThread = useSelector(state => state.threadReducer.thread);
    const username = useSelector(state => state.userReducer.username);
    const results = useSelector(state => state.responseReducer.valenceResults);

    const constructMetadata = () => {
        return {
            ...currentThread.startMessage.commentMetadata,
            author: username,
            datetime: dayjs().format("YYYY-MM-DD HH:mm:ss").toString(),
            id: dayjs().unix().toString(),
            msg_type: "comment",
            parent_comment_id: currentThread.startMessage.commentMetadata.comment_id,
            parent_datetime: currentThread.startMessage.commentMetadata.datetime,
        }
    }

    const constructMessage = () => {
        const metadata = constructMetadata();
        return {
            commentMetadata: metadata,
            words: analysisResults,
            sentenceValencePredictions: results
        }
    }

    return (
        <div className="response-analysis">
            <AnnotatedMessage
                data={constructMessage()}
                wordLevelAnnotations={annotations}
                messageLevelAnnotations={annotations}
            />
            <ResponseField />
        </div>
    )
}

export default ResponseAnalysis;
