import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import testdata from "../../testData/threadData_s24_03.json";

import "./thread.css";
import {
    updateAvailableRawThreads,
    updateCurrentRawThread,
    updateCurrentRawThreadIndex
} from "../../actions/rawDataActions";
import { updateCurrentThread } from "../../actions/threadActions";

import MessageArea from "../messageArea/messageArea";
import ThreadChanger from "../threadChanger/threadChanger";
export class Thread extends Component {

    componentDidMount = async () => {
        this.props.updateAvailableRawThreads(testdata);
    }

    componentDidUpdate = (prevProps) => {

        const threadRawDataChanged = prevProps.availableRawThreads !== this.props.availableRawThreads;
        const threadIndexChanged = prevProps.currentRawThreadIndex !== this.props.currentRawThreadIndex;

        if ((threadRawDataChanged || threadIndexChanged)
            && this.props.availableRawThreads[this.props.currentRawThreadIndex]) {
            this.props.updateCurrentRawThread(
                this.props.availableRawThreads[
                this.props.currentRawThreadIndex
                ]
            );
        }

        if (prevProps.currentRawThread !== this.props.currentRawThread) {
            this.handleNewRawData(this.props.currentRawThread);
        }
    }

    handleNewRawData = (data) => {
        const [comments, responses] = this.separateResponsesFromComments(data.comments)
        const commentsWithResponses = this.moveResponsesToTheirParents(comments, responses);
        data.comments = commentsWithResponses

        this.props.updateCurrentThread(data);
    }

    separateResponsesFromComments = (rawComments) => {
        const groupedComments = _.groupBy(rawComments, comment => {
            return comment.commentMetadata.parent_comment_id === "0";
        });

        const comments = groupedComments["true"];
        const responses = groupedComments["false"];
        return [comments, responses];
    }

    moveResponsesToTheirParents = (comments, responses) => {
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

    getCurrentThreadTitle = () => {
        if (this.props.currentThread && this.props.currentThread.metadata) {
            return this.props.currentThread.metadata.title
        }
        return "Thread title";
    }

    render() {
        return (
            <div className="thread">
                <ThreadChanger
                    currentIndex={this.props.currentRawThreadIndex}
                    updateIndex={(index) => this.props.updateCurrentRawThreadIndex(index)}
                    maxIndex={this.props.availableRawThreads.length - 1}
                />
                <div className="title">
                    {this.getCurrentThreadTitle()}
                </div>
                <MessageArea />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentRawThread: state.rawDataReducer.currentThread,
        currentRawThreadIndex: state.rawDataReducer.currentIndex,
        availableRawThreads: state.rawDataReducer.availableThreads,
        currentThread: state.threadReducer.thread
    };
}

const mapDispatchToProps = {
    updateAvailableRawThreads,
    updateCurrentRawThread,
    updateCurrentThread,
    updateCurrentRawThreadIndex
}

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
