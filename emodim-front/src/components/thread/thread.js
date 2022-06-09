import React, { Component } from "react";
import { connect } from "react-redux";
import "./thread.css";
import MessageArea from "../messageArea/messageArea";
import Button from '@material-ui/core/Button';
import socketIOClient from "socket.io-client";
import {
    chatEndpoint,
    buttonTexts
} from "../../constants";

export class Thread extends Component {
    constructor(props) {
        super(props);
        
        this.handleSend = this.handleSend.bind(this);
        this.socket = socketIOClient(chatEndpoint);
    }

    componentDidMount() {
        this.socket.on("thread", thread => {
            thread = thread;
        })
    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    getCurrentThreadTitle = () => {
        if (this.props.currentThread && this.props.currentThread.metadata) {
            return this.props.currentThread.metadata.title
        }
        return "Thread title";
    }

    // Send current thread to backend to be saved in a json file.
    handleSend = (event) => {
        const threadData = this.props.currentThread;
        this.socket.emit("thread", threadData);
    }

    render() {
        return (
            <div className="thread">
                <div className="title">
                    {this.getCurrentThreadTitle()}
                </div>
                <MessageArea/>
                <Button
                    type="submit"
                    onClick={this.handleSend}
                >{buttonTexts.save_thread}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentRawThread: state.rawDataReducer.currentThread,
        currentRawThreadIndex: state.rawDataReducer.currentIndex,
        availableRawThreads: state.rawDataReducer.availableThreads,
        currentThread: state.threadReducer.thread,
    };
}

export default connect(mapStateToProps)(Thread);
