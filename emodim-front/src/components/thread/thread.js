import React from "react";

import MessageArea from "../messageArea/messageArea";

import "./thread.css";

const Thread = () => {
    return (
        <div className="thread">
            <h1>Kommentit</h1>
            <MessageArea/>
        </div>
    )
}

export default Thread;