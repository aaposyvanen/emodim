import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { END_TEST } from "../../actions/endActions";
import "../buttons.css";
import "./endPage.css";
import { instructionTexts } from "../../constants";

const EndPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch({ type: END_TEST });
        history.push("/");
        window.location.reload();
    }
    return (
        <div className="end-content">
            <h1>{instructionTexts.endTitle}</h1>
            <div className="text">
                <p>{instructionTexts.endText}</p>
            </div>
            <Button
                className="button-primary"
                onClick={handleClick}
            >Alkuun</Button>
        </div>
    )
}

export default EndPage;