import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../api/supabase';

const EditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { post: locationPost } = location.state || {};

  const [title, setTitle] = useState(locationPost?.title || '');
  const [content, setContent] = useState(locationPost?.content || '');
  const [imageUrl, setImageUrl] = useState(locationPost?.image_url || '');
  const [loading, setLoading] = useState(!locationPost);

  useEffect(() => {
    if (!locationPost) {
      const fetchPost = async () => {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          navigate('/');
        } else {
          setTitle(data.title);
          setContent(data.content);
          setImageUrl(data.image_url);
          setLoading(false);
        }
      }

      fetchPost();
    }
  }, [id, locationPost, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from('posts')
      .update({ title, content, image_url: imageUrl })
      .eq('id', id);

    if (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } else {
      alert('Post updated successfully!');
      navigate(`/post/${id}`);
    }
  }

  if (loading) {
    return <div>Loading post details...</div>;
  }

  return (
    <form onSubmit={handleUpdate} className="form-container">
      <h1>Edit Post</h1>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="imageUrl">Image URL (optional)</label>
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
        />
      </div>
      <button type = "submit" class="btn">
        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Update Post
      </button>
    </form>
  )
}

export default EditPost;