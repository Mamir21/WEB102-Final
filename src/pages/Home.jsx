import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import PostCard from '../components/PostCard';

const Home = ({ searchTerm }) => {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState('created_at');

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase.from('posts').select('*');
      
      if (sortOrder === 'upvotes') {
        query = query.order('upvotes', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    }

    fetchPosts();
  }, [searchTerm, sortOrder]);

  const handleSort = (order) => {
    setSortOrder(order);
  }

  return (
    <div className="home-container">
      <div className="order-section">
        <span className="order-label">Order by:</span>
        <button
          className={`order-button ${sortOrder === 'created_at' ? 'active' : ''}`}
          onClick={() => handleSort('created_at')}
        >
          Newest
        </button>
        <button
          className={`order-button ${sortOrder === 'upvotes' ? 'active' : ''}`}
          onClick={() => handleSort('upvotes')}
        >
          Most Popular
        </button>
      </div>

      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  )
}

export default Home;