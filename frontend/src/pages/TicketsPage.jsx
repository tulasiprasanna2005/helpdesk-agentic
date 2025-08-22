import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/tickets', {
          headers: {
            'x-auth-token': token,
          },
        });
        setTickets(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tickets');
        setLoading(false);
        console.error('Fetch tickets error:', err);
      }
    };
    fetchTickets();
  }, [navigate]);

  if (loading) return <div>Loading tickets...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2>My Support Tickets</h2>
        <Link to="/tickets/new">
          <button className="btn btn-primary">Create New Ticket</button>
        </Link>
      </div>
      
      {tickets.length > 0 ? (
        <ul className="list-container">
          {tickets.map(ticket => (
            <li key={ticket._id} className="list-item">
              <Link to={`/tickets/${ticket._id}`}>
                <h3>{ticket.title}</h3>
                <p>Status: {ticket.status}</p>
                <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tickets found. Create a new one!</p>
      )}
    </div>
  );
};

export default TicketsPage;