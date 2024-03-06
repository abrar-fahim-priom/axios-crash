import { useEffect, useState } from "react";
import "./App.css";
import api from "./api/api.js";
import AddPost from "./components/AddPost.jsx";
import EditPost from "./components/EditPost.jsx";
import Posts from "./components/Posts";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null); // post I am editing
  const [error, setError] = useState(null);

  const handleAddPost = async (newPost) => {
    try {
      const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;

      const finalPost = {
        ...newPost,
        id: id.toString(),
      };

      const response = await api.post("/posts", finalPost);

      setPosts([...posts, response.data]); //in post api, gives response as what i just posted
    } catch (error) {
      //checking the full error handling in custom created api interceptor
      setError(error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (confirm("Are you sure you want to delete the post?")) {
      try {
        await api.delete(`/posts/${postId}`);
        const newPosts = posts.filter((post) => post.id !== postId);
        setPosts(newPosts);
      } catch (error) {
        setError(error.message);
      }
    } else {
      console.log("You chose not to delete the post!");
    }
  };

  const handleEditPost = async (updatedPost) => {
    try {
      const response = await api.patch(`/posts/${updatedPost.id}`, updatedPost);
      const updatedPosts = posts.map((post) =>
        post.id === response.data.id ? response.data : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      setError(
        `status : ${error.response.status} - Message : ${error.response.data}`
      );
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        if (response && response.data) {
          setPosts(response.data);
        }
      } catch (error) {
        //ddint reach to server
        setError(error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <div>
        <h1>API Request with api</h1>
        <hr />

        <div>
          <Posts
            posts={posts}
            onDeletePost={handleDeletePost}
            onEditClick={setPost}
          />

          <hr />

          {!post ? (
            <AddPost onAddPost={handleAddPost} />
          ) : (
            <EditPost post={post} onEditPost={handleEditPost} />
          )}

          {error && (
            <>
              <hr />
              <div className="error">{error}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
