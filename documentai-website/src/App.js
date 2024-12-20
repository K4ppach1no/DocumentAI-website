// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatApp from './Classes/ChatApp';
import ManageCollections from './Classes/ManageCollections';
import ManageChats from './Classes/ManageChats';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatApp />} />
        <Route path="/manage-collections" element={<ManageCollections />} />
        <Route path="/manage-chats" element={<ManageChats />} />
      </Routes>
    </Router>
  );
}

export default App;