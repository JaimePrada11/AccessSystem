import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Logins/login';
import SignIn from './components/Logins/SingIn';
import Layout from './layout';
import MainContainer from './pages/main';
import Companies from './pages/Companies';
import CompanyInfo from './pages/CompanyInfo';
import People from './pages/People';
import Vehicle from './pages/Vehicles';
import Equipments from './pages/Equipments';
import Memberships from './pages/Memberships';

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
          <Route path="/vehicles" element={<Vehicle />} />
          <Route path="/equipments" element={<Equipments />} />
          <Route path="/memberships" element={<Memberships />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
