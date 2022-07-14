import React, { useEffect } from 'react';
import Layout from './layout/layout';
import './app.css';
import {
    Switch,
    Route,
    Link,
  } from "react-router-dom";
import { updateAvailableRawThreads } from "../actions/rawDataActions";
import { useDispatch } from "react-redux";
import EndPage from './endPage/endPage';
import Home from './home/home';
/* data for test */
import json from "../testData/testData.json";

const App = () => {
    const dispatch = useDispatch();

    //Read all threads (includin news articles and annotations) from json file and save in rawDataReducer
    useEffect(() => {
        dispatch(updateAvailableRawThreads(json));
    }, [dispatch]);

    return (
        <div className='app'>
            <div className='nav'>
                    {/* <Link to="/">Asetukset</Link> */}
                </div>
            <div className='content'>
                <Switch>
                    <Route path="/forum">
                        <Layout/>
                    </Route>
                    <Route path="/end">
                        <EndPage/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default App;