import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { Button, TextField } from "@material-ui/core";

import { updateUsername } from "../../actions/userActions";
import { userSelectionStrings, buttonTexts } from "../../constants";

import "./userSelection.css";
import "../buttons.css";

const UserSelection = () => {
    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState("");
    const [helperText, setHelperText] = useState("");

    /**
     * Save username in redux state.
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue) {
            dispatch(updateUsername(inputValue));
            setHelperText("");
        } else {
            setHelperText(userSelectionStrings.helperText);
        }
    }

    const handleChange = event => {
        setInputValue(event.target.value);
    }

    return (
        <form className="user-selection" onSubmit={handleSubmit}>
            {userSelectionStrings.primaryInstruction}
            <TextField
                type="text"
                value={inputValue}
                onChange={handleChange}
                helperText={helperText}
                autoFocus
                InputProps={{ disableUnderline: true }}
            />
            <Button
                type="submit"
                className="button-primary"
                disabled={!inputValue}
            >
                {buttonTexts.ready}
            </Button>
        </form>
    )
}

export default UserSelection;
