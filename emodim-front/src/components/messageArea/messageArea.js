import React, { useEffect, useRef } from "react";

import _ from "lodash";
import socketIOClient from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";

import { addMessageToCurrentThread } from "../../actions/threadActions";
import AnnotatedMessage from "../annotatedMessage/annotatedMessage";
import { chatEndpoint, responseSection } from "../../constants";
import Comment from "../comment/comment";
import { formWordArrayFromAnalyzedData } from "../../utils/messageUtils";
import ResponseSection from "../responseSection/responseSection";
import { updateCurrentThread } from "../../actions/threadActions";

import "./messageArea.css";

/**
 * Separates comments and responses.
 * Responses have a parent_comment_id, comments don't.
 * @param {Array} rawComments 
 * @returns {Array} rawComments separated into comments and responses
 */
export const separateResponsesFromComments = (rawComments) => {
    const groupedComments = _.groupBy(rawComments, comment => {
        return !comment.commentMetadata.parent_comment_id;
    });

    const comments = groupedComments["true"];
    const responses = groupedComments["false"];
    return [comments, responses];
}

/**
 * Moves responses to their parent comment's children array.
 * @param {Array} comments 
 * @param {Array} responses 
 * @returns {Array} messageChain with responses as children.
 */
export const moveResponsesToTheirParents = (comments, responses) => {
    const messageChain = [];

    _.forEach(comments, comment => {
        // Find the children of each comment.
        // A response is comment's child if its parentID matches the commentId.
        const children = _.filter(responses, response => {
            const parentId = response.commentMetadata.parent_comment_id;
            const commentId = comment.commentMetadata.comment_id;
            return parentId === commentId
        });

        // If children were found for the comment.
        if (!_.isEmpty(children)) {
            // If comment already has a children array add new children to the end of the array.
            if (_.has(comment, "children")) {
                comment.children = _.concat(comment.children, children);
            } else {
                comment.children = children;
            }
        }

        // Add comment with children to the message chain.
        messageChain.push(comment);
    });

    return messageChain;
}

export const MessageArea = () => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
 
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

    /**
     * Update thread when new comment is added
     */
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
                <h2>{responseSection.header}</h2>
                <ResponseSection 
                    wordLevelAnnotations={currentAnnotations.feedback.wordHighlights}
                    messageLevelAnnotations={currentAnnotations.feedback.messageAnalysis}
                    toggleResponsefield={null}
                    commentId={0}
                />
            </div>
        </div>
    );
}

export default MessageArea;