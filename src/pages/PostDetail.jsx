import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import CommentForm from '../components/CommentForm';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
      if (error) console.error('Error fetching post:', error);
      else setPost(data);
    }

    const fetchComments = async () => {
      const { data, error } = await supabase.from('comments').select('*').eq('post_id', id).order('created_at');
      if (error) console.error('Error fetching comments:', error);
      else setComments(data);
    }

    fetchPost();
    fetchComments();
  }, [id]);

  const handleUpvote = async () => {
    if (post) {
      const { error } = await supabase.from('posts').update({ upvotes: post.upvotes + 1 }).eq('id', id);
      if (error) console.error('Error upvoting:', error);
      else setPost({ ...post, upvotes: post.upvotes + 1 });
    }
  }

  const handleEdit = () => {
    navigate(`/edit/${id}`, { state: { post } });
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting post:', error);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="post-detail-container">
      {post ? (
        <div className="post-detail-card">
          <div className="post-detail-header">
            <span className="post-timestamp">
              Posted {new Date(post.created_at).toLocaleString()}
            </span>
            <h1 className="post-title">{post.title}</h1>
          </div>
          
          {post.image_url && (
            <div className="post-image-container">
              <img src={post.image_url} alt="Post" className="post-image" />
            </div>
          )}
          
          <div className="post-content">
            <p>{post.content}</p>
          </div>

          <div className="post-actions">
            <button className="action-button upvote-button" onClick={handleUpvote}>
              <span className="button-icon">👍</span>
              <span>{post.upvotes} upvotes</span>
            </button>
            <div className="action-buttons-right">
              <button className="action-button edit-button" onClick={handleEdit}>
                <span className="button-icon">✏️</span>
                Edit
              </button>
              <button className="action-button delete-button" onClick={handleDelete}>
                <span className="button-icon">🗑️</span>
                Delete
              </button>
            </div>
          </div>

          <div className="comments-section">
            <h2 className="comments-title">Comments</h2>
            <CommentForm postId={id} onCommentAdded={() => fetchComments()} />
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p className="comment-content">{comment.content}</p>
                  <span className="comment-timestamp">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  )
}

export default PostDetail;