import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUsername } from "../../actions/userActions";
import { Button, TextField } from "@material-ui/core";
import { userSelectionStrings, buttonTexts } from "../../constants";
import "./userSelection.css"

const UserSelection = () => {
    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState("");
    const [helperText, setHelperText] = useState("");

    const handleClick = username => {
        if (username) {
            dispatch(updateUsername(username));
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
            />
            <Button
                onClick={() => handleClick(inputValue)}
            >
                {buttonTexts.ready}
            </Button>
        </div>
    )
}

export default UserSelection;
