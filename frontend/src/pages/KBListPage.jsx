import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const KBListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/kb');
        setArticles(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch articles');
        setLoading(false);
        console.error('Fetch articles error:', err);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2>Knowledge Base Articles</h2>
        <Link to="/kb/new">
          <button className="btn btn-primary">Create New Article</button>
        </Link>
      </div>
      
      {articles.length > 0 ? (
        <ul className="list-container">
          {articles.map(article => (
            <li key={article._id} className="list-item">
              <Link to={`/kb/${article._id}`}>
                <h3>{article.title}</h3>
                <p>Tags: {article.tags.join(', ')}</p>
                <p>Status: {article.status}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No articles found. Create a new one!</p>
      )}
    </div>
  );
};

export default KBListPage;