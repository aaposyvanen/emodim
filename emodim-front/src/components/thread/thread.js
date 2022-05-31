import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Switch,
    Redirect,
    Route
} from "react-router-dom";
import "./thread.css";
import MessageArea from "../messageArea/messageArea";
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
                <Switch>
                    <Route path="/1">
                        <MessageArea feedbackHighlighting={false} feedbackAnnotations={false} messageHighlighting={false} messageAnnotations={false} />
                    </Route>
                    <Route path="/2">
                        <MessageArea feedbackHighlighting={false} feedbackAnnotations={false} messageHighlighting={false} messageAnnotations={true} />
                    </Route>

                    <Route path="/3">
                        <MessageArea feedbackHighlighting={false} feedbackAnnotations={false} messageHighlighting={true} messageAnnotations={false} />
                    </Route>
                    <Route path="/4">
                        <MessageArea feedbackHighlighting={false} feedbackAnnotations={false} messageHighlighting={true} messageAnnotations={true} />
                    </Route>

                    <Route path="/5">
                        <MessageArea feedbackHighlighting={false} feedbackAnnotations={true} messageHighlighting={false} messageAnnotations={false} />
                    </Route>
                    <Route path="/6">
                        <MessageArea feedbackHighlighting={false} feedbackAnnotations={true} messageHighlighting={false} messageAnnotations={true} />
                    </Route>

                    <Route path="/7">
                        <MessageArea feedbackHighlighting={false} feedbackAnnotations={true} messageHighlighting={true} messageAnnotations={false} />
                    </Route>
                    <Route path="/8">
                        <MessageArea feedbackHighlighting={false} feedbackAnnotations={true} messageHighlighting={true} messageAnnotations={true} />
                    </Route>
                    <Route path="/9">
                        <MessageArea feedbackHighlighting={true} feedbackAnnotations={false} messageHighlighting={false} messageAnnotations={false} />
                    </Route>
                    <Route path="/10">
                        <MessageArea feedbackHighlighting={true} feedbackAnnotations={false} messageHighlighting={false} messageAnnotations={true} />
                    </Route>

                    <Route path="/11">
                        <MessageArea feedbackHighlighting={true} feedbackAnnotations={false} messageHighlighting={true} messageAnnotations={false} />
                    </Route>
                    <Route path="/12">
                        <MessageArea feedbackHighlighting={true} feedbackAnnotations={false} messageHighlighting={true} messageAnnotations={true} />
                    </Route>

                    <Route path="/13">
                        <MessageArea feedbackHighlighting={true} feedbackAnnotations={true} messageHighlighting={false} messageAnnotations={false} />
                    </Route>
                    <Route path="/14">
                        <MessageArea feedbackHighlighting={true} feedbackAnnotations={true} messageHighlighting={false} messageAnnotations={true} />
                    </Route>

                    <Route path="/15">
                        <MessageArea feedbackHighlighting={true} feedbackAnnotations={true} messageHighlighting={true} messageAnnotations={false} />
                    </Route>
                    <Route path="/16">
                        <MessageArea feedbackHighlighting={true} feedbackAnnotations={true} messageHighlighting={true} messageAnnotations={true} />
                    </Route>
                    <Route path="/">
                        <Redirect to="/16" />
                    </Route>
                </Switch>
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

export default connect(mapStateToProps)(Thread);
