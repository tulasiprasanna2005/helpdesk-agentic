import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/config');
        setConfig(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch config.');
        setLoading(false);
        console.error('Fetch config error:', err);
      }
    };
    fetchConfig();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value),
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        return navigate('/login');
    }
    try {
      await axios.put('http://localhost:5000/api/config', config, {
          headers: {
              'x-auth-token': token,
          },
      });
      alert('Settings updated successfully!');
    } catch (err) {
      console.error('Update config failed:', err.response ? err.response.data : err.message);
      alert('Failed to update settings. You may not have admin access.');
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!config) return <div>No configuration found.</div>;

  return (
    <div className="card">
      <h2>Settings (Admin Only)</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="autoCloseEnabled"
              checked={config.autoCloseEnabled}
              onChange={onChange}
            />
            Enable Auto-Close
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="confidenceThreshold">Confidence Threshold (0-1):</label>
          <input
            type="number"
            id="confidenceThreshold"
            name="confidenceThreshold"
            value={config.confidenceThreshold}
            onChange={onChange}
            step="0.01"
            min="0"
            max="1"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="slaHours">SLA Hours:</label>
          <input
            type="number"
            id="slaHours"
            name="slaHours"
            value={config.slaHours}
            onChange={onChange}
            min="1"
            className="form-input"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Settings</button>
      </form>
    </div>
  );
};

export default SettingsPage;