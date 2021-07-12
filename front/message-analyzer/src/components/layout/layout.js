import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import {
    updateAvailableRawThreads,
    updateCurrentRawThread,
    updateCurrentRawThreadIndex
} from "../../actions/rawDataActions";
import { updateCurrentThread } from "../../actions/threadActions";
import json from "../../testData/threadData_s24_04.json";
import Thread from "../thread/thread";
import ThreadChanger from "../threadChanger/threadChanger";
import "./layout.css";

export const Layout = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateAvailableRawThreads(json));
    }, [dispatch]);

    const availableRawThreads = useSelector(state => state.rawDataReducer.availableThreads);
    const currentRawThreadIndex = useSelector(state => state.rawDataReducer.currentIndex);
    const currentRawThread = useSelector(state => state.rawDataReducer.currentThread)

    useEffect(() => {
        if (currentRawThread && currentRawThread.comments) {
            const [comments, responses] = separateResponsesFromComments(currentRawThread.comments)
            const commentsWithResponses = moveResponsesToTheirParents(comments, responses);
            const reverseOrderedComments = _.reverse(commentsWithResponses); // newest comments are shown first
            currentRawThread.comments = reverseOrderedComments;
            dispatch(updateCurrentThread(currentRawThread));
        }
    }, [currentRawThread, dispatch]);

    const separateResponsesFromComments = (rawComments) => {
        const groupedComments = _.groupBy(rawComments, comment => {
            return comment.commentMetadata.parent_comment_id === "0";
        });

        const comments = groupedComments["true"];
        const responses = groupedComments["false"];
        return [comments, responses];
    }

    const moveResponsesToTheirParents = (comments, responses) => {
        const messageChain = [];

        _.forEach(comments, comment => {
            // Find the children of each comment
            const children = _.filter(responses, response => {
                const parentId = response.commentMetadata.parent_comment_id;
                const commentId = comment.commentMetadata.id.split(":")[1];
                return parentId === commentId
            });

            if (!_.isEmpty(children)) {
                if (_.has(comment, "children")) {
                    _.concat(comment.children, children)
                } else {
                    comment.children = children;
                }
            }
            messageChain.push(comment);
        });
        return messageChain;
    }

    useEffect(() => {
        if (!_.isEmpty(availableRawThreads)) {
            dispatch(updateCurrentRawThread(availableRawThreads[currentRawThreadIndex]));
        }
    }, [availableRawThreads, currentRawThreadIndex, dispatch]);

    return (
        <div className="layout">
            <div className="forum-view">
                <ThreadChanger
                    currentIndex={currentRawThreadIndex}
                    updateIndex={(index) => dispatch(updateCurrentRawThreadIndex(index))}
                    maxIndex={availableRawThreads.length - 1}
                />
                <Thread />
            </div>
        </div>
    );
}

export default Layout;
