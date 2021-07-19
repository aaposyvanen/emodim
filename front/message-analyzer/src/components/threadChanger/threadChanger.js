import React from "react";
import { useDispatch } from "react-redux";
import Button from '@material-ui/core/Button';
import { updateMessageText } from "../../actions/responseActions";
import "./threadChanger.css";

const ThreadChanger = (props) => {
    const dispatch = useDispatch();

    const increaseIndex = () => {
        if (props.currentIndex < props.maxIndex) {
            props.updateIndex(props.currentIndex + 1);
            dispatch(updateMessageText(""));

        }
    };

    const decreaseIndex = () => {
        if (props.currentIndex > 0) {
            props.updateIndex(props.currentIndex - 1);
            dispatch(updateMessageText(""));

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
