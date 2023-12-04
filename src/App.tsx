import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import Header from './components/Header/Header';

function App() {
  return (
    <BrowserRouter>
      <Header/>
    </BrowserRouter>
  );
}

export default App;
