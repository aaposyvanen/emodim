import React, { useState, useRef } from "react";
import "./forumView.css";

const FrameWrapper = ({ article, image }) => {
    const ref = useRef();
    const [frameHeight, setFrameHeight] = useState("0px");

    const onLoad = () => {
        // Set the height of the frame to match the lenght of the content.
        setFrameHeight(ref.current.contentWindow.document.body.scrollHeight + "px");

        // Set the uploaded image as the image source.
        if (article && image) {
            const imageTag = document.querySelector("iframe").contentWindow.document.querySelector("img");
            imageTag.src = image;
        }
    }

    return (
        <iframe
            className="article"
            ref={ref}
            onLoad={onLoad}
            id="myFrame"
            src={article}
            width="100%"
            height={frameHeight}
            scrolling="no"
            frameBorder="0"
        ></iframe>
    )
}

export default FrameWrapper;