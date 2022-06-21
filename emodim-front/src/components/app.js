import React, { useEffect } from 'react';
import AnnotationSelection from './annotationSelection/annotationSelection';
import Layout from './layout/layout';
import './app.css';
import {
    Switch,
    Route,
    Link,
  } from "react-router-dom";
import _ from "lodash";
import {
    updateAvailableRawThreads,
    updateCurrentRawThread,
} from "../actions/rawDataActions";
import { updateCurrentThread } from "../actions/threadActions";
import json from "../testData/test.json";
import { useSelector, useDispatch } from "react-redux";

export const separateResponsesFromComments = (rawComments) => {
    const groupedComments = _.groupBy(rawComments, comment => {
        return comment.commentMetadata.parent_comment_id === "0";
    });

    const comments = groupedComments["true"];
    const responses = groupedComments["false"];
    return [comments, responses];
}

export const moveResponsesToTheirParents = (comments, responses) => {
    const messageChain = [];

    _.forEach(comments, comment => {
        // Find the children of each comment
        const children = _.filter(responses, response => {
            const parentId = response.commentMetadata.parent_comment_id;
            const commentId = comment.commentMetadata.comment_id;
            return parentId === commentId
        });

        if (!_.isEmpty(children)) {
            if (_.has(comment, "children")) {
                comment.children = _.concat(comment.children, children);
                
            } else {
                comment.children = children;
            }
        }

        messageChain.push(comment);
    });
    return messageChain;
}

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateAvailableRawThreads(json));
    }, [dispatch]);

    const availableRawThreads = useSelector(state => state.rawDataReducer.availableThreads);
    const currentRawThread = useSelector(state => state.rawDataReducer.currentThread)

    useEffect(() => {
        if (currentRawThread && currentRawThread.comments) {
            const [comments, responses] = separateResponsesFromComments(currentRawThread.comments)
            const commentsWithResponses = moveResponsesToTheirParents(comments, responses);
            currentRawThread.comments = commentsWithResponses;
            dispatch(updateCurrentThread(currentRawThread));
        }
    }, [currentRawThread, dispatch]);

    useEffect(() => {
        if (!_.isEmpty(availableRawThreads)) {
            dispatch(updateCurrentRawThread(availableRawThreads[0]));
        }
    }, [availableRawThreads, dispatch]);

    return (
        <div className='app'>
            <div className='nav'>
                    <Link to="/">Asetukset</Link>
                </div>
            <div className='content'>
                
                <Switch>
                    <Route path="/forum">
                        <Layout/>
                    </Route>
                    <Route path="/">
                        <AnnotationSelection/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default App;