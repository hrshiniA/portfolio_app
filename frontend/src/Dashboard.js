import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get('http://localhost:5000/portfolio', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPortfolio(res.data);
      } catch (err) {
        alert('Error fetching portfolio');
      }
    };
    fetchPortfolio();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Portfolio Overview</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Current Value</th>
            <th>Purchase Price</th>
            <th>Performance (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.current_value}</td>
              <td>{item.purchase_price}</td>
              <td>{(((item.current_value - item.purchase_price) / item.purchase_price) * 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;