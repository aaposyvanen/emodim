import React, { useState, useRef } from "react";
import "./forumView.css";
import { errorMessages } from "../../constants";

const FrameWrapper = ({ article, image }) => {
    const ref = useRef();
    const [frameHeight, setFrameHeight] = useState(0);

    const onLoad = () => {

        // Set the height of the frame to match the lenght of the content.
        const height = document.querySelector("iframe").contentWindow.document.querySelector("div").scrollHeight;
        setFrameHeight(height + 50);

        // Set the uploaded image as the image source.
        if (article && image) {
            const imageTag = document.querySelector("iframe").contentWindow.document.querySelector("img");
            if (imageTag) {
                imageTag.src = image;
            }
        }
    }

    if (article) {
        return (
            <iframe
                title="articleFrame"
                className="article"
                onLoad={onLoad}
                ref={ref}
                src={article}
                height={frameHeight}
                scrolling="no"
                frameBorder="0"
            ></iframe>
        )
    }
    else {
        return (
            <div>{errorMessages.noArticle}</div>
        )
    }
    
}

export default FrameWrapper;