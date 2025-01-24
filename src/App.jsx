import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/login';
import SignIn from './components/SingIn';  
import Layout from './layout';
import MainContainer from './pages/main';
import Companies from './pages/Companies';
import CompanyInfo from './pages/CompanyInfo';
import People from './pages/People';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<Layout />}>
          <Route path="/" element={<MainContainer />} />
          <Route path="/company" element={<Companies />} />
          <Route path="/people" element={<People />} />
          <Route path="/company/:id" element={<CompanyInfo />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
