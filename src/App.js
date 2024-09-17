import React from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Objective from './components/Objective';
import TestComponent from './components/TestComponent';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/objetivo" element={<Objective />} />
          <Route path="/test" element={<TestComponent />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
