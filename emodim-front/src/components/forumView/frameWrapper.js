import React, { useState, useRef } from "react";

import { errorMessages } from "../../constants";

import "./forumView.css";

const FrameWrapper = ({ article, image }) => {
    const ref = useRef();

    const [frameHeight, setFrameHeight] = useState(0);

    const onLoad = () => {
        // Set the height of the frame to match the length of the content.
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