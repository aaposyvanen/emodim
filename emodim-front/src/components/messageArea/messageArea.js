import React, { Component } from "react";
import { connect } from "react-redux";

import "./messageArea.css";
import AnnotatedMessage from "../annotatedMessage/annotatedMessage";
import ResponseField from "../responseField/responseField";
import ResponseAnalysisDialog from "../responseAnalysisDialog/responseAnalysisDialog";

export class MessageArea extends Component {

    render() {
        return (
            <div className="message-area">
                <div className="thread-start">
                    {
                        this.props.startMessage.commentMetadata
                            ?
                            <AnnotatedMessage
                                data={this.props.startMessage}
                                wordLevelAnnotations={this.props.currentAnnotations.message.wordHighlights}
                                messageLevelAnnotations={this.props.currentAnnotations.message.messageAnalysis}
                                emoji={this.props.currentAnnotations.message.emoji}
                                sidebar={this.props.currentAnnotations.message.sidebar}
                            />
                            :
                            null
                    }
                </div>

                <div className="comments">
                    {
                        this.props.comments && this.props.comments.map(comment => {
                            if (comment && comment.commentMetadata) {
                                return <AnnotatedMessage
                                    data={comment}
                                    key={comment.commentMetadata.comment_id}
                                    wordLevelAnnotations={this.props.currentAnnotations.message.wordHighlights}
                                    messageLevelAnnotations={this.props.currentAnnotations.message.messageAnalysis}
                                    emoji={this.props.currentAnnotations.message.emoji}
                                    sidebar={this.props.currentAnnotations.message.sidebar}
                                />
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
                <div className="response-section">
                    <ResponseField />
                    <ResponseAnalysisDialog 
                        wordLevelAnnotations={this.props.currentAnnotations.feedback.wordHighlights}
                        messageLevelAnnotations={this.props.currentAnnotations.feedback.messageAnalysis}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        startMessage: state.threadReducer.thread.startMessage,
        comments: state.threadReducer.thread.comments,
        currentAnnotations: state.annotationsReducer.annotations,
    };
}


export default connect(mapStateToProps)(MessageArea);
