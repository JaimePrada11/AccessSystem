// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Logins/login';
import SignIn from './components/Logins/SingIn';
import Layout from './layout';
import MainContainer from './pages/main';
import Companies from './pages/Companies';
import CompanyInfo from './pages/Company/CompanyInfo';
import People from './pages/People/People';
import Vehicle from './pages/Vehicles';
import Equipments from './pages/People/Equipments';
import Memberships from './pages/Memberships';
import Invoice from './pages/Invoice';
import PersonInfo from './pages/PersonInfo';
import Access from './pages/Access';
import { UserProvider } from './Context'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<MainContainer />} />
            <Route path="/company" element={<Companies />} />
            <Route path="/people" element={<People />} />
            <Route path="/people/:id" element={<PersonInfo />} />
            <Route path="/company/:id" element={<CompanyInfo />} />
            <Route path="/access/" element={<Access />} />         
            <Route path="/vehicles" element={<Vehicle />} />
            <Route path="/equipments" element={<Equipments />} />
            <Route path="/memberships" element={<Memberships />} />
            <Route path="/invoice" element={<Invoice />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
