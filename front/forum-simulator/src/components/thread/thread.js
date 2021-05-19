import React, { Component } from "react";

import "./thread.css";
import Message from "../message/message";

class Thread extends Component {

    render() {
        return (
            <div className="thread">
                <div className="title">
                    Thread title
                </div>
                <div className="start-message">
                    First message in thread
                </div>
                <div className="comments">
                    Here go the comments
                </div>
            </div>
        );
    }
}

export default Thread;
