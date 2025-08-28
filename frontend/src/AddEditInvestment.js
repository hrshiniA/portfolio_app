import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function AddEditInvestment() {
  const { id } = useParams(); // For edit mode
  const isEdit = !!id;
  const [formData, setFormData] = useState({ name: '', type: '', current_value: 0, purchase_price: 0, quantity: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/portfolio/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setFormData(res.data);
        } catch (err) {
          console.error('Error fetching investment:', err);
          alert('Error fetching investment');
        }
      };
      fetchItem();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/portfolio/${id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post('http://localhost:5000/portfolio', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Add transaction for new investment (buy action)
        await axios.post('http://localhost:5000/transactions', {
          asset_name: formData.name,
          type: 'buy',
          quantity: formData.quantity, // Use quantity from form (default 1)
          price: formData.purchase_price,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving investment:', err);
      alert('Error saving investment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Type (stock/bond/fund)"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      />
      <input
        type="number"
        placeholder="Current Value"
        value={formData.current_value}
        onChange={(e) => setFormData({ ...formData, current_value: parseFloat(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Purchase Price"
        value={formData.purchase_price}
        onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Quantity (default 1)"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
      />
      <button type="submit">{isEdit ? 'Update' : 'Add'} Investment</button>
    </form>
  );
}

export default AddEditInvestment;