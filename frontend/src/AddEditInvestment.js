import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import './AddEditInvestment.css';

function AddEditInvestment() {
  const { id } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState({ 
    name: '', 
    type: 'stock', 
    current_value: '', 
    purchase_price: '', 
    quantity: '1' 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isEdit) {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/portfolio/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setFormData({
            name: res.data.name || '',
            type: res.data.type || 'stock',
            current_value: res.data.current_value?.toString() || '',
            purchase_price: res.data.purchase_price?.toString() || '',
            quantity: res.data.quantity?.toString() || '1'
          });
        } catch (err) {
          console.error('Error fetching investment:', err);
          alert('Error fetching investment');
        }
      };
      fetchItem();
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Investment name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Investment name must be at least 2 characters';
    }
    
    if (!formData.type) {
      newErrors.type = 'Investment type is required';
    }
    
    if (!formData.current_value || isNaN(formData.current_value) || parseFloat(formData.current_value) < 0) {
      newErrors.current_value = 'Current value must be a valid positive number';
    }
    
    if (!formData.purchase_price || isNaN(formData.purchase_price) || parseFloat(formData.purchase_price) <= 0) {
      newErrors.purchase_price = 'Purchase price must be a valid positive number';
    }
    
    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a valid positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        current_value: parseFloat(formData.current_value),
        purchase_price: parseFloat(formData.purchase_price),
        quantity: parseFloat(formData.quantity)
      };

      if (isEdit) {
        await axios.put(`http://localhost:5000/portfolio/${id}`, submitData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('http://localhost:5000/portfolio', submitData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        // Add transaction for new investment (buy action)
        await axios.post('http://localhost:5000/transactions', {
          asset_name: submitData.name,
          type: 'buy',
          quantity: submitData.quantity,
          price: submitData.purchase_price,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving investment:', err);
      alert('Error saving investment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Calculate performance preview
  const currentValue = parseFloat(formData.current_value) || 0;
  const purchasePrice = parseFloat(formData.purchase_price) || 0;
  const quantity = parseFloat(formData.quantity) || 1;
  const totalCurrentValue = currentValue * quantity;
  const totalCost = purchasePrice * quantity;
  const totalGain = totalCurrentValue - totalCost;
  const gainPercent = totalCost > 0 ? ((totalGain / totalCost) * 100) : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getAssetTypeIcon = (type) => {
    switch (type) {
      case 'stock':
        return (
          <svg className="asset-type-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
          </svg>
        );
      case 'bond':
        return (
          <svg className="asset-type-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
        );
      case 'fund':
        return (
          <svg className="asset-type-icon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
            <path fillRule="evenodd" d="M3 8a2 2 0 012-2v9a2 2 0 01-2-2V8zm14 0a2 2 0 00-2-2v9a2 2 0 002-2V8z" clipRule="evenodd"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="add-edit-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
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
          <h1 className="header-title">
            {isEdit ? 'Edit Investment' : 'Add Investment'}
          </h1>
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
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">
                {isEdit ? 'Update Investment Details' : 'Add New Investment'}
              </h2>
              <p className="form-subtitle">
                {isEdit 
                  ? 'Update the details of your investment below.'
                  : 'Enter the details of your new investment to add it to your portfolio.'
                }
              </p>
            </div>

            <div className="form-body">
              <form onSubmit={handleSubmit} className="investment-form">
                {/* Basic Information Section */}
                <div className="form-section">
                  <h3 className="section-title">Basic Information</h3>
                  
                  <div className="form-group">
                    <label className="form-label required">Investment Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Apple Inc., Government Bond, S&P 500 ETF"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <div className="error-message">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Asset Type</label>
                    <div className="asset-type-group">
                      <div className="asset-type-option">
                        <input
                          type="radio"
                          id="stock"
                          name="type"
                          value="stock"
                          checked={formData.type === 'stock'}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="asset-type-input"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="stock" className="asset-type-label">
                          {getAssetTypeIcon('stock')}
                          <span className="asset-type-name">Stock</span>
                          <p className="asset-type-desc">Individual company shares</p>
                        </label>
                      </div>
                      <div className="asset-type-option">
                        <input
                          type="radio"
                          id="bond"
                          name="type"
                          value="bond"
                          checked={formData.type === 'bond'}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="asset-type-input"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="bond" className="asset-type-label">
                          {getAssetTypeIcon('bond')}
                          <span className="asset-type-name">Bond</span>
                          <p className="asset-type-desc">Fixed income securities</p>
                        </label>
                      </div>
                      <div className="asset-type-option">
                        <input
                          type="radio"
                          id="fund"
                          name="type"
                          value="fund"
                          checked={formData.type === 'fund'}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="asset-type-input"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="fund" className="asset-type-label">
                          {getAssetTypeIcon('fund')}
                          <span className="asset-type-name">Fund</span>
                          <p className="asset-type-desc">ETFs & mutual funds</p>
                        </label>
                      </div>
                    </div>
                    {errors.type && (
                      <div className="error-message">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {errors.type}
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Details Section */}
                <div className="form-section">
                  <h3 className="section-title">Financial Details</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">Current Value (per share)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.current_value}
                        onChange={(e) => handleInputChange('current_value', e.target.value)}
                        className={`form-input ${errors.current_value ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.current_value && (
                        <div className="error-message">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          {errors.current_value}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label required">Purchase Price (per share)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        value={formData.purchase_price}
                        onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                        className={`form-input ${errors.purchase_price ? 'error' : ''}`}
                        disabled={isSubmitting}
                      />
                      {errors.purchase_price && (
                        <div className="error-message">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                          {errors.purchase_price}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Quantity</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="1"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className={`form-input ${errors.quantity ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.quantity && (
                      <div className="error-message">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {errors.quantity}
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Preview */}
                {(currentValue > 0 && purchasePrice > 0 && quantity > 0) && (
                  <div className="performance-preview">
                    <h4 className="preview-title">Performance Preview</h4>
                    <div className="preview-metrics">
                      <div className="preview-metric">
                        <p className="metric-label">Total Value</p>
                        <p className="metric-value neutral">{formatCurrency(totalCurrentValue)}</p>
                      </div>
                      <div className="preview-metric">
                        <p className="metric-label">Total Cost</p>
                        <p className="metric-value neutral">{formatCurrency(totalCost)}</p>
                      </div>
                      <div className="preview-metric">
                        <p className="metric-label">Gain/Loss</p>
                        <p className={`metric-value ${totalGain >= 0 ? 'positive' : 'negative'}`}>
                          {formatCurrency(totalGain)}
                        </p>
                      </div>
                      <div className="preview-metric">
                        <p className="metric-label">Return</p>
                        <p className={`metric-value ${gainPercent >= 0 ? 'positive' : 'negative'}`}>
                          {formatPercentage(gainPercent)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner"></div>
                        {isEdit ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {isEdit ? 'Update Investment' : 'Add Investment'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddEditInvestment;