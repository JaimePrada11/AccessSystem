import { useState } from 'react';
import Login from './components/Login';
import SignIn from './components/SingIn';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Menu from './components/Menu';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/' element={<Menu/>} />
      </Routes>
    </Router>
  );
}

export default App;
