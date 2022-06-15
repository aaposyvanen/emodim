import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import "./messageArea.css";
import AnnotatedMessage from "../annotatedMessage/annotatedMessage";
import Comment from "../comment/comment";
import ResponseSection from "../responseSection/responseSection";
import { updateCurrentThread } from "../../actions/threadActions";
import { separateResponsesFromComments, moveResponsesToTheirParents} from "../app"
import SaveThread from "../saveThread/saveThread";
import { chatEndpoint } from "../../constants";
import socketIOClient from "socket.io-client";
import { formWordArrayFromAnalyzedData } from "../responseAnalysisDialog/responseAnalysisDialog";
import { addMessageToCurrentThread } from "../../actions/threadActions";

export const MessageArea = () => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);

    const startMessage = useSelector(state => state.threadReducer.thread.startMessage); 
    const currentAnnotations = useSelector( state => state.annotationsReducer.annotations);
    const currentThread = useSelector(state => state.threadReducer.thread);
    const currentComments = useSelector(state => state.threadReducer.thread.comments);
    
    useEffect(() => {
        const socket = socketIOClient(chatEndpoint);
        socketRef.current = socket;

        socket.on("message", message => {
            message.words = formWordArrayFromAnalyzedData(message.words);
            dispatch(addMessageToCurrentThread(message));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    useEffect(() => {
        if (currentThread && currentComments) {
            const [comments, responses] = separateResponsesFromComments(currentThread.comments);
            const commentsWithResponses = moveResponsesToTheirParents(comments, responses);
            currentThread.comments = commentsWithResponses;
            dispatch(updateCurrentThread(currentThread));
        }
    }, [currentThread, dispatch]);

    return (
        <div className="message-area">
            <div className="thread-start">
                {
                    startMessage.commentMetadata
                        ?
                        <AnnotatedMessage
                            data={startMessage}
                            wordLevelAnnotations={currentAnnotations.message.wordHighlights}
                            messageLevelAnnotations={currentAnnotations.message.messageAnalysis}
                            emoji={currentAnnotations.message.emoji}
                            sidebar={currentAnnotations.message.sidebar}
                            response={true}
                        />
                        :
                        null
                }
            </div>

            <div className="comments">
                {
                    currentThread.comments && currentThread.comments.map(comment => {
                        if (comment && comment.commentMetadata) {
                            return (
                                <div key={`div-${comment.commentMetadata.comment_id}`}>
                                    <Comment
                                        data={comment}
                                        key={comment.commentMetadata.comment_id}
                                        wordLevelAnnotations={currentAnnotations.message.wordHighlights}
                                        messageLevelAnnotations={currentAnnotations.message.messageAnalysis}
                                        emoji={currentAnnotations.message.emoji}
                                        sidebar={currentAnnotations.message.sidebar}
                                    />
                                    {comment.children && !_.isEmpty(comment.children)
                                        ? <div className="replies">
                                            {
                                                comment.children.map(child => {
                                                    return <AnnotatedMessage
                                                        data={child}
                                                        key={child.commentMetadata.comment_id}
                                                        response
                                                        wordLevelAnnotations={currentAnnotations.message.wordHighlights}
                                                        messageLevelAnnotations={currentAnnotations.message.messageAnalysis}
                                                        emoji={currentAnnotations.message.emoji}
                                                        sidebar={currentAnnotations.message.sidebar}
                                                    />
                                                })
                                            }
                                         </div>
                                        : null
                                    }
                                </div>
                            )
                        } else {
                            return null;
                        }
                    })
                }
            </div>
            <div className="response-section">
                <ResponseSection 
                    wordLevelAnnotations={currentAnnotations.feedback.wordHighlights}
                    messageLevelAnnotations={currentAnnotations.feedback.messageAnalysis}
                    toggleResponsefield={null}
                    commentId={0}
                />
            </div>
            <SaveThread/>
        </div>
    );
}

export default MessageArea;
