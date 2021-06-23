import React from "react";
import Button from '@material-ui/core/Button';
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
            <Button onClick={decreaseIndex} >
                Prev
            </Button>
            <div className="current-thread-label">{props.currentIndex + 1}</div>
            <Button onClick={increaseIndex} >
                Next
            </Button>
        </div>
    )
}

export default ThreadChanger;
