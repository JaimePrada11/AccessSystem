import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login';
import SignIn from './components/SingIn';  
import Layout from './layout';
import MainContainer from './pages/main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<MainContainer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
