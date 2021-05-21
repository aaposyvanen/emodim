import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import "./messageArea.css";
import Message from "../message/message";

export class MessageArea extends Component {

    render() {
        return (
            <div className="message-area">
                <div className="thread-start">
                    <Message message={this.props.startMessage} />
                </div>
                <div className="comments">
                    {
                        _.map(this.props.comments, (comment) => {
                            < Message message={comment} key={comment.commentID} />
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        thread: state.threadReducer.currentThread,
        startMessage: state.threadReducer.currentThread.threadStartMessage,
        comments: state.threadReducer.currentThread.comments
    };
}


export default connect(mapStateToProps)(MessageArea);
