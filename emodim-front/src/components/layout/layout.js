import React from "react";

import { useSelector } from "react-redux";

import ForumView from "../forumView/forumView";
import UserSelection from "../userSelection/userSelection";

import "./layout.css";

/*
 * Shows username form if no username has been chosen yet 
 */
export const Layout = () => {
    const username = useSelector(state => state.userReducer.username);
    const usernameIsChosen = username !== "";    

    return (
        <div className="layout">
            {usernameIsChosen
                ? <ForumView />
                : <UserSelection />}
        </div>
    );
}

export default Layout;
