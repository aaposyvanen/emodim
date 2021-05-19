import React, { Component } from "react";
import { connect } from "react-redux";

import testdata from "../../testData/threadData_s24_01.json";

import "./thread.css";

import { updateThread } from "../../actions/threads";

export class Thread extends Component {

    componentDidMount = async () => {
        this.props.updateThread(testdata);
    }

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

const mapStateToProps = state => {
    return {
        currentThread: state.threadReducer.currentThread
    };
}

const mapDispatchToProps = {
    updateThread
}

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
