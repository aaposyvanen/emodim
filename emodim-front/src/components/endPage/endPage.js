import React from "react";

import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { END_TEST } from "../../actions/endActions";
import { instructionTexts } from "../../constants";

import "../buttons.css";
import "./endPage.css";

const EndPage = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    /**
     * Clean redux state and return to home page.
     */
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