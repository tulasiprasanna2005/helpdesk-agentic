import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const KBEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If an ID exists in the URL, fetch the article data for editing
    if (id) {
      const fetchArticle = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/kb?query=${id}`);
          const article = res.data[0]; // Assuming the ID query returns a single item in an array
          if (article) {
            setFormData({
              title: article.title,
              body: article.body,
              tags: article.tags.join(', '),
              status: article.status,
            });
          }
        } catch (err) {
          setError('Failed to fetch article details.');
          console.error(err);
        }
      };
      fetchArticle();
    }
  }, [id]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const articleData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
    };

    try {
      if (id) {
        // Update existing article
        await axios.put(`http://localhost:5000/api/kb/${id}`, articleData, {
          headers: { 'x-auth-token': token },
        });
      } else {
        // Create new article
        await axios.post('http://localhost:5000/api/kb', articleData, {
          headers: { 'x-auth-token': token },
        });
      }
      navigate('/kb'); // Redirect to KB list on success
    } catch (err) {
      setError('Failed to save article. You may not have admin access.');
      console.error(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const onDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token || !window.confirm('Are you sure you want to delete this article?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/kb/${id}`, {
        headers: { 'x-auth-token': token },
      });
      navigate('/kb');
    } catch (err) {
      setError('Failed to delete article. You may not have admin access.');
      console.error(err.response ? err.response.data : err.message);
    }
  };

  if (loading) return <div>Saving article...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card">
      <h2>{id ? 'Edit KB Article' : 'Create New Article'}</h2>
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
          <label htmlFor="body">Body:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={onChange}
            rows="10"
            className="form-textarea"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={formData.status} onChange={onChange} className="form-select">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" className="btn btn-primary">Save Article</button>
          {id && (
            <button type="button" onClick={onDelete} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default KBEditPage;