import React from "react";

import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { buttonTexts, instructionTexts } from "../../constants";
import { updateCurrentThread } from "../../actions/threadActions";
import { updateAnnotations } from '../../actions/annotationActions';
import { updateNewsArticle } from "../../actions/newsActions";
import { updateCurrentIndex } from "../../actions/rawDataActions";

import "../buttons.css";
import "./home.css";

const Home = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const availableRawThreads = useSelector(state => state.rawDataReducer.availableThreads);

    /**
     * Show the first thread.
     */
    const handleClick = () => {
        dispatch(updateCurrentIndex(0));
        dispatch(updateCurrentThread(availableRawThreads[0]));
        const article = availableRawThreads[0].newsArticle;
        dispatch(updateNewsArticle(article));
        const annotations = availableRawThreads[0].annotations;
        dispatch(updateAnnotations(annotations));

        history.push("/forum");
    }

    return (
        <div className="home">
            <h1>{instructionTexts.startTitle}</h1>
            <div className="text">
                <p>{instructionTexts.startText}</p>
            </div>
            <Button
                className="button-primary"
                onClick={handleClick}
            >{buttonTexts.start}</Button>
        </div>
    )
}

export default Home;