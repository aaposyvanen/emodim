import React, { Component } from "react";
import { connect } from "react-redux";

import testdata from "../../testData/threadData_s24_01.json";

import "./thread.css";
import {
    updateAvailableThreads,
    updateCurrentThread
} from "../../actions/threads";

export class Thread extends Component {

    componentDidMount = async () => {
        this.props.updateAvailableThreads(testdata);
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.availableThreads !== this.props.availableThreads
            && this.props.availableThreads[0]) {
            this.props.updateCurrentThread(this.props.availableThreads[0]);
        }
    }

    getCurrentThreadTitle = () => {
        if (this.props.currentThread && this.props.currentThread.threadMetadata) {
            return this.props.currentThread.threadMetadata.title
        }
        return "Thread title";
    }

    render() {
        return (
            <div className="thread">
                <div className="title">
                    {this.getCurrentThreadTitle()}
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

const mapStateToProps = state => {
    return {
        currentThread: state.threadReducer.currentThread,
        availableThreads: state.threadReducer.availableThreads
    };
}

const mapDispatchToProps = {
    updateAvailableThreads,
    updateCurrentThread
}

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
