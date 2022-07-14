import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { Button } from "@material-ui/core";
import { buttonTexts, chatEndpoint } from "../../constants";
import Thread from "../thread/thread";
import "./forumView.css";
import "../buttons.css";
import FrameWrapper from "./frameWrapper";
import { useSelector, useDispatch } from "react-redux";
import { updateCurrentIndex } from "../../actions/rawDataActions";
import { useHistory } from "react-router-dom";
import { updateCurrentThread } from "../../actions/threadActions";
import { updateAnnotations } from '../../actions/annotationActions';
import { updateNewsArticle } from "../../actions/newsActions";
import { constructThread } from "../../utils/threadUtils";

export const ForumView = () => {
    const dispatch = useDispatch();
    const currentArticle = useSelector(state => state.newsReducer.article.file);
    const currentImage = useSelector(state => state.newsReducer.article.image);
    const currentNews = useSelector(state => state.newsReducer.article);
    const currentAnnotations = useSelector(state => state.annotationsReducer);

    const [threadsLength, setThreadsLength] = useState(0);
    const [lastThread, setLastThread] = useState(false);
    const availableRawThreads = useSelector(state => state.rawDataReducer.availableThreads);
    const currentIndex = useSelector(state => state.rawDataReducer.currentIndex);

    const socketRef = useRef(null);
    const history = useHistory();
    // Gets current message thread from redux state.
    const currentThread = useSelector(state => state.threadReducer.thread);
    
    // Import articles and images dynamically
    const importFolder = (r) => {
        let images = {};
        r.keys().forEach((item, index) => { images[item.replace("./", "")] = r(item)});
        return images;
    }

    const images = importFolder(require.context("../../testData/images", false, /\.(png|jpe?g|svg)$/));
    const articles = importFolder(require.context("../../testData/articles", false, /\.(htm)$/));

    // Converts thread object to json and makes it into a dowload link.
    // Simulates mouse click to start the download immediately.
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

    const sendThreadToServer = () => {
        const newThread = constructThread(currentThread, currentAnnotations, currentNews);
        socketRef.current.emit("thread", newThread);
    }

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
                article={articles[currentArticle] ? articles[currentArticle].default : null}
                image={images[currentImage] ? images[currentImage].default : null}
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