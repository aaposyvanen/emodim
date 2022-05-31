import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUsername } from "../../actions/userActions";
import { Button, TextField } from "@material-ui/core";
import { userSelectionStrings, buttonTexts } from "../../constants";
import "./userSelection.css";
import "../buttons.css";

const UserSelection = () => {
    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState("");
    const [helperText, setHelperText] = useState("");

    const handleClick = username => {
        if (username) {
            dispatch(updateUsername(username));
            setHelperText("");
        } else {
            setHelperText(userSelectionStrings.helperText);
        }
    }

    const handleChange = event => {
        setInputValue(event.target.value);
    }

    return (
        <div className="user-selection">
            {userSelectionStrings.primaryInstruction}
            <TextField
                value={inputValue}
                onChange={handleChange}
                helperText={helperText}
                autoFocus
                InputProps={{ disableUnderline: true }}
            />
            <Button
                className="button-primary"
                onClick={() => handleClick(inputValue)}
                disabled={!inputValue}
            >
                {buttonTexts.ready}
            </Button>
        </div>
    )
}

export default UserSelection;
