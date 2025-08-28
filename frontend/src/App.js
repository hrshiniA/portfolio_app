import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import AddEditInvestment from './AddEditInvestment';

function App() {
  return <div>Hello from Front-end</div>;
}

function App() {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/transactions" element={token ? <Transactions /> : <Navigate to="/login" />} />
        <Route path="/add-investment" element={token ? <AddEditInvestment /> : <Navigate to="/login" />} />
        <Route path="/edit-investment/:id" element={token ? <AddEditInvestment /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;