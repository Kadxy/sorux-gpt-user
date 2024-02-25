import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import List from './components/List';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
            </Routes>
            <Routes>
                <Route path="/login" element={<Login/>}/>
            </Routes>
            <Routes>
                <Route path="/list" element={<List/>}/>
            </Routes>
        </Router>
    );
}

export default App;
