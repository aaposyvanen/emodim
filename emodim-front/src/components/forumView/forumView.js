import React from "react";
import Thread from "../thread/thread";
import "./forumView.css";
import { useSelector } from "react-redux";
import FrameWrapper from "./frameWrapper";

export const ForumView = () => {
    const article = useSelector(state => state.newsReducer.article);
    const image = useSelector(state => state.newsReducer.image);

    return (
        <div className="forum-view">
            <FrameWrapper
                article={article}
                image={image}
            />
            <Thread/>
        </div>
    );
}

export default ForumView;