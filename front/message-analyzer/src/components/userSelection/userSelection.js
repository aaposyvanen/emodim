import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUsername } from "../../actions/userActions";
import { Button, TextField } from "@material-ui/core";
import "./userSelection.css"

const UserSelection = () => {
    const dispatch = useDispatch();

    const [inputValue, setInputValue] = useState("");
    const [helperText, setHelperText] = useState("");

    const handleClick = username => {
        if (username) {
            dispatch(updateUsername(username));
        } else {
            setHelperText("You need to choose a nickname.");
        }
    }

    const handleChange = event => {
        setInputValue(event.target.value);
    }

    return (
        <div className="user-selection">
            Select a nickname
            <TextField
                value={inputValue}
                onChange={handleChange}
                // variant="outlined"
                helperText={helperText}
            // TODO: THIS NEEDS TO WORK WITH ENTER KEY!
            />
            <Button
                onClick={() => handleClick(inputValue)}
            >
                Ready
            </Button>
        </div>
    )
}

export default UserSelection;
