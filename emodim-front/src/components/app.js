import React from 'react';
import AnnotationSelection from './annotationSelection/annotationSelection';
import Layout from './layout/layout';
import './app.css';
import {
    Switch,
    Route,
    Link,
  } from "react-router-dom"

const App = () => {
    return (
        <div className='app'>
            <div className='nav'>
                    <Link to="/">Asetukset</Link>
                </div>
            <div className='content'>
                
                <Switch>
                    <Route path="/forum">
                        <Layout/>
                    </Route>
                    <Route path="/">
                        <AnnotationSelection/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default App;