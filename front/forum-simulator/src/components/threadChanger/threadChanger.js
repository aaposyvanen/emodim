import React from "react";
import "./threadChanger.css";

const ThreadChanger = (props) => {

    const increaseIndex = () => {
        if (props.currentIndex < props.maxIndex) {
            props.updateIndex(props.currentIndex + 1);
        }
    };

    const decreaseIndex = () => {
        if (props.currentIndex > 0) {
            props.updateIndex(props.currentIndex - 1);
        }
    };

    return (
        <div className="thread-changer">
            <button
                className="thread-change-button"
                onClick={decreaseIndex}
            >
                Prev
            </button>
            <div className="current-thread-label">{props.currentIndex + 1}</div>
            <button
                className="thread-change-button"
                onClick={increaseIndex}
            >
                Next
            </button>
        </div>
    )
}

export default ThreadChanger;
