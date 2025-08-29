import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ManulifeLogo from './assets/logo2.png';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/transactions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTransactions(res.data);
        setFilteredTransactions(res.data);
      } catch (err) {
        alert('Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Handle filter change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(tx => tx.type === filter));
    }
  }, [filter, transactions]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate summary data
  const totalTransactions = transactions.length;
  const buyTransactions = transactions.filter(tx => tx.type === 'buy').length;
  const sellTransactions = transactions.filter(tx => tx.type === 'sell').length;
  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.price * tx.quantity), 0);

  return (
    <div className="transactions-container">
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
          <h1 className="header-title">Transaction History</h1>
          <div className="header-actions">
            <button 
              className="back-btn"
              onClick={() => navigate('/dashboard')}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portfolio
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="content-area">
          {/* Transaction summary */}
          <div className="transaction-summary">
            <div className="summary-card">
              <h3>Total Transactions</h3>
              <p className="summary-value">{totalTransactions}</p>
              <p className="summary-description">All time activity</p>
            </div>
            <div className="summary-card">
              <h3>Buy Orders</h3>
              <p className="summary-value">{buyTransactions}</p>
              <p className="summary-description">Purchase transactions</p>
            </div>
            <div className="summary-card">
              <h3>Sell Orders</h3>
              <p className="summary-value">{sellTransactions}</p>
              <p className="summary-description">Sale transactions</p>
            </div>
            <div className="summary-card">
              <h3>Total Volume</h3>
              <p className="summary-value">{formatCurrency(totalVolume)}</p>
              <p className="summary-description">Transaction value</p>
            </div>
          </div>

          {/* Transactions table */}
          <div className="transactions-section">
            <div className="section-header">
              <h2 className="section-title">Recent Transactions</h2>
              <div className="filter-controls">
                <select 
                  className="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="buy">Buy Orders</option>
                  <option value="sell">Sell Orders</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                Loading transactions...
              </div>
            ) : filteredTransactions.length > 0 ? (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <span className="asset-name">{tx.asset_name}</span>
                      </td>
                      <td>
                        <span className={`transaction-type ${tx.type}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>{tx.quantity}</td>
                      <td className="price">{formatCurrency(tx.price)}</td>
                      <td className="price">{formatCurrency(tx.price * tx.quantity)}</td>
                      <td className="date">{formatDate(tx.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                <h3>No transactions found</h3>
                <p>
                  {filter === 'all' 
                    ? 'You haven\'t made any transactions yet. Start investing to see your transaction history here.'
                    : `No ${filter} transactions found. Try changing the filter to see more results.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Transactions;