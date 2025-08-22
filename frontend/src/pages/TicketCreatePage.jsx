import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketCreatePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return navigate('/login');
      }

      await axios.post('http://localhost:5000/api/tickets', formData, {
        headers: {
          'x-auth-token': token,
        },
      });

      navigate('/tickets');
    } catch (err) {
      console.error('Ticket creation failed:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="card">
      <h2>Create a New Ticket</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            rows="10"
            className="form-textarea"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category (optional):</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onChange}
            className="form-select"
          >
            <option value="">Select a category</option>
            <option value="billing">Billing</option>
            <option value="tech">Tech</option>
            <option value="shipping">Shipping</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketCreatePage;