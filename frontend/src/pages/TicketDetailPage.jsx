import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const TicketDetailPage = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [agentSuggestion, setAgentSuggestion] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.user.role);

        const res = await axios.get(`http://localhost:5000/api/tickets/${id}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setTicket(res.data.ticket);
        setAgentSuggestion(res.data.suggestion);
        setAuditLog(res.data.auditLogs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ticket data.');
        setLoading(false);
        console.error('Fetch ticket error:', err.response ? err.response.data : err.message);
      }
    };
    fetchTicketData();
  }, [id, navigate]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      await axios.post(`http://localhost:5000/api/tickets/${id}/reply`, { draftReply: replyText }, {
        headers: {
          'x-auth-token': token,
        },
      });
      alert('Reply sent and ticket resolved!');
      // Re-fetch data to update the UI
      setLoading(true);
      navigate(0); // This reloads the page to show changes
    } catch (err) {
      console.error('Reply submission failed:', err.response ? err.response.data : err.message);
      alert('Failed to send reply.');
    }
  };
  
  const handleAssignTicket = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      await axios.post(`http://localhost:5000/api/tickets/${id}/assign`, {}, {
        headers: {
          'x-auth-token': token,
        },
      });
      alert('Ticket assigned to you!');
      // Re-fetch data to update the UI
      setLoading(true);
      navigate(0);
    } catch (err) {
      console.error('Assign ticket failed:', err.response ? err.response.data : err.message);
      alert('Failed to assign ticket.');
    }
  };

  if (loading) return <div>Loading ticket details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ticket) return <div>Ticket not found.</div>;

  const isAgent = userRole === 'agent' || userRole === 'admin';

  return (
    <div className="card">
      <h2>Ticket: {ticket.title}</h2>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Description:</strong> {ticket.description}</p>
      <p><strong>Created by:</strong> {ticket.createdBy.name} on {new Date(ticket.createdAt).toLocaleString()}</p>
      
      {isAgent && ticket.status === 'waiting_human' && (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={handleAssignTicket} className="btn btn-primary">
            Assign to Me
          </button>
        </div>
      )}

      {isAgent && agentSuggestion && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Agent Suggestion</h3>
          <p><strong>Predicted Category:</strong> {agentSuggestion.predictedCategory}</p>
          <p><strong>Confidence:</strong> {agentSuggestion.confidence}</p>
          <p><strong>Draft Reply:</strong> {agentSuggestion.draftReply}</p>
        </div>
      )}

      {isAgent && ticket.status !== 'resolved' && (
        <form onSubmit={handleReplySubmit} style={{ marginTop: '1rem' }}>
          <h3>Send a Reply</h3>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows="5"
            className="form-textarea"
            placeholder="Type your reply here..."
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Send Reply & Resolve
          </button>
        </form>
      )}
      
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Audit Timeline</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {auditLog.map((log, index) => (
            <li key={index} className="timeline-item">
              <p><strong>Action:</strong> {log.action}</p>
              <p><strong>Actor:</strong> {log.actor}</p>
              <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
              <p><strong>Trace ID:</strong> {log.traceId}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketDetailPage;