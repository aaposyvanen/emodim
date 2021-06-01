import React, { Component } from "react";
import { connect } from "react-redux";

import "./messageArea.css";
import Message from "../message/message";

export class MessageArea extends Component {

    render() {
        return (
            <div className="message-area">
                <div className="thread-start">
                    <Message
                        data={this.props.startMessage}
                        styleWords={false}
                    />
                </div>
                <div className="comments">
                    {
                        this.props.comments && this.props.comments.map(comment => {
                            return < Message
                                data={comment}
                                key={comment.commentMetadata.id}
                                styleWords={false}
                            />
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        startMessage: state.threadReducer.thread.startMessage,
        comments: state.threadReducer.thread.comments
    };
}


export default connect(mapStateToProps)(MessageArea);
