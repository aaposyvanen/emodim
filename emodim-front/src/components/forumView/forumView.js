import React, { useEffect, useState, useRef } from "react";

import { Button } from "@material-ui/core";
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { buttonTexts, chatEndpoint } from "../../constants";
import { constructThread } from "../../utils/threadUtils";
import FrameWrapper from "./frameWrapper";
import Thread from "../thread/thread";
import { updateCurrentIndex } from "../../actions/rawDataActions";
import { updateCurrentThread } from "../../actions/threadActions";
import { updateAnnotations } from '../../actions/annotationActions';
import { updateNewsArticle } from "../../actions/newsActions";

import "../buttons.css";
import "./forumView.css";

export const ForumView = () => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const history = useHistory();

    const currentThread = useSelector(state => state.threadReducer.thread);
    const currentNews = useSelector(state => state.newsReducer.article);
    const currentAnnotations = useSelector(state => state.annotationsReducer);
    const availableRawThreads = useSelector(state => state.rawDataReducer.availableThreads);
    const currentIndex = useSelector(state => state.rawDataReducer.currentIndex);

    const [threadsLength, setThreadsLength] = useState(0);
    const [lastThread, setLastThread] = useState(false);

    /**
     * Import articles and images dynamically.
     * @param {function} r 
     * @returns {object} items in the folder
     */
    const importFolder = (r) => {
        let folder = {};
        r.keys().forEach((item, index) => { folder[item.replace("./", "")] = r(item)});
        return folder;
    }

    const images = importFolder(require.context("../../testData/images", false, /\.(png|jpe?g|svg)$/));
    const articles = importFolder(require.context("../../testData/articles", false, /\.(htm)$/));

    /**
     * Save the thread on the server and move to next thread.
     */
    const handleClick = () => {
        sendThreadToServer();

        if (currentIndex < threadsLength - 1) {
            const newIndex = currentIndex + 1;
            dispatch(updateCurrentIndex(newIndex));
            dispatch(updateCurrentThread(availableRawThreads[newIndex]));
            const article = availableRawThreads[newIndex].newsArticle;
            dispatch(updateNewsArticle(article));
            const annotations = availableRawThreads[newIndex].annotations;
            dispatch(updateAnnotations(annotations));
        }

        window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    }

    /**
     * Send the current thread to server.
     */
    const sendThreadToServer = () => {
        const newThread = constructThread(currentThread, currentAnnotations, currentNews);
        socketRef.current.emit("thread", newThread);
    }

    /**
     * Save the thread on the server, clear session storage and move to the end page.
     */
    const handleQuit = () => {
        sendThreadToServer();
        sessionStorage.clear();
        history.push("/end");
    }
    
    useEffect(() => {
        if (availableRawThreads) {
            setThreadsLength(availableRawThreads.length);
        }
        if (currentIndex === availableRawThreads.length - 1) {
            setLastThread(true);
        }
    }, [availableRawThreads, currentIndex]);

    useEffect(() => {
        const socket = socketIOClient(chatEndpoint);
        socketRef.current = socket;

        return () => socket.disconnect();
    }, []);

    return (
        <div className="forum-view">
            <FrameWrapper
                article={articles[currentNews.file] ? articles[currentNews.file].default : null}
                image={images[currentNews.image] ? images[currentNews.image].default : null}
            />
            <Thread/>
            { lastThread
                ? <Button
                    className="button-big"
                    size="large"
                    variant="contained"
                    onClick={handleQuit}
                  >{buttonTexts.quit}</Button>
                : <Button
                    className="button-big"
                    size="large"
                    variant="contained"
                    onClick={handleClick}
                  >{buttonTexts.next}</Button>
            }
        </div>
    );
}

export default ForumView;