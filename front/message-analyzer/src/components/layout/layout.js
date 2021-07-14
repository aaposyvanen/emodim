import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import ForumView from "../forumView/forumView";
import UserSelection from "../userSelection/userSelection";
import "./layout.css";

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
