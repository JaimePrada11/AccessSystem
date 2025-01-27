// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/Logins/login';
import SignIn from './pages/Logins/SingIn';
import Layout from './layout';
import MainContainer from './pages/main';
import Companies from './pages/Company/Companies';
import CompanyInfo from './pages/Company/CompanyInfo';
import People from './pages/People/People';
import Vehicle from './pages/People/Vehicles';
import Equipments from './pages/People/Equipments';
import Memberships from './pages/Invoices/Memberships';
import Invoice from './pages/Invoices/Invoice';
import PersonInfo from './pages/People/PersonInfo';
import Access from './pages/Access/Access';
import { UserProvider } from './Context'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route element={<Layout />}>
            <Route path="/" element={<MainContainer />} />
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
