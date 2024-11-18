import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <Link to={`/post/${post.id}`}>
        <h2>{post.title}</h2>
        <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
        <p>Upvotes: {post.upvotes}</p>
      </Link>
    </div>
  )
}

export default PostCard;