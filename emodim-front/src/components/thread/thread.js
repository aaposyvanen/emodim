import React, { Component } from "react";
import { connect } from "react-redux";
import "./thread.css";
import MessageArea from "../messageArea/messageArea";
import SaveThread from "../saveThread/saveThread";

export class Thread extends Component {

    getCurrentThreadTitle = () => {
        if (this.props.currentThread && this.props.currentThread.metadata) {
            return this.props.currentThread.metadata.title
        }
        return "Thread title";
    }

    render() {
        return (
            <div className="thread">
                <div className="title">
                    {this.getCurrentThreadTitle()}
                </div>
                <MessageArea
                    separateResponsesFromComments={this.props.separateResponsesFromComments}
                    moveResponsesToTheirParents={this.props.moveResponsesToTheirParents}
                />
                <SaveThread/>
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