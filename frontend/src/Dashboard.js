import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ManulifeLogo from './assets/logo2.png';
import './Dashboard.css';

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Calculate portfolio summary
  const totalValue = portfolio.reduce((sum, item) => sum + item.current_value, 0);
  const totalCost = portfolio.reduce((sum, item) => sum + item.purchase_price, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? ((totalGain / totalCost) * 100) : 0;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Get asset type class
  const getAssetTypeClass = (type) => {
    return `asset-type ${type.toLowerCase()}`;
  };

  // Get performance class
  const getPerformanceClass = (current, purchase) => {
    const gain = current - purchase;
    return `performance ${gain >= 0 ? 'positive' : 'negative'}`;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <img src={ManulifeLogo} alt="Manulife Logo" className="logo-icon" />
            </div>
            <h2 className="logo-text">Portfolio</h2>
          </div>
          <button 
            className="menu-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                <svg className="nav-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                <span className="nav-text">Portfolio</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/transactions" 
                className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}
              >
                <svg className="nav-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                <span className="nav-text">Transactions</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="logout-section">
          <button className="logout-button" onClick={handleLogout}>
            <svg className="nav-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Top header */}
        <header className="top-header">
          <h1 className="header-title">Portfolio Overview</h1>
          <div className="header-actions">
            <button 
              className="add-investment-btn"
              onClick={() => navigate('/add-investment')}
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Add Investment
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="content-area">
          {/* Portfolio summary */}
          <div className="portfolio-summary">
            <div className="summary-card">
              <h3>Total Portfolio Value</h3>
              <p className="summary-value">{formatCurrency(totalValue)}</p>
            </div>
            <div className="summary-card">
              <h3>Total Cost Basis</h3>
              <p className="summary-value">{formatCurrency(totalCost)}</p>
            </div>
            <div className="summary-card">
              <h3>Total Gain/Loss</h3>
              <p className="summary-value">{formatCurrency(totalGain)}</p>
              <p className={`summary-change ${totalGain >= 0 ? 'positive' : 'negative'}`}>
                {formatPercentage(totalGainPercent)}
              </p>
            </div>
            <div className="summary-card">
              <h3>Total Assets</h3>
              <p className="summary-value">{portfolio.length}</p>
            </div>
          </div>

          {/* Portfolio table */}
          <div className="portfolio-section">
            <div className="section-header">
              <h2 className="section-title">Your Investments</h2>
            </div>
            
            {portfolio.length > 0 ? (
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Current Value</th>
                    <th>Purchase Price</th>
                    <th>Performance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item) => {
                    const performance = ((item.current_value - item.purchase_price) / item.purchase_price) * 100;
                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          <span className={getAssetTypeClass(item.type)}>
                            {item.type}
                          </span>
                        </td>
                        <td>{formatCurrency(item.current_value)}</td>
                        <td>{formatCurrency(item.purchase_price)}</td>
                        <td>
                          <span className={getPerformanceClass(item.current_value, item.purchase_price)}>
                            {formatPercentage(performance)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => navigate(`/edit-investment/${item.id}`)}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                </svg>
                <h3>No investments yet</h3>
                <p>Start building your portfolio by adding your first investment.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;