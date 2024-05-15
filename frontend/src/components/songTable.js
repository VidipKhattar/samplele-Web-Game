import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const [songPosts, setSongPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/songposts`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/songposts`
      )
      .then((response) => {
        setSongPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching song posts:", error);
        setLoading(false);
      });
  }, []);

  const handleSongDelete = (id) => {
    const updatedSongPosts = songPosts.map((post) => {
      if (post.id === id) {
        return { ...post, deleting: true };
      }
      return post;
    });
    setSongPosts(updatedSongPosts);

    axios
      .delete(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/songposts/${id}`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/songposts/${id}`
      )
      .then((response) => {
        const remainingPosts = songPosts.filter((post) => post.id !== id);
        setSongPosts(remainingPosts);
      })
      .catch((error) => {
        console.error("Error deleting song post:", error);
      });
  };

  const renderSongPosts = () => {
    const today = new Date();
    const todayDateString = today.toISOString().split("T")[0];
    return songPosts.map((post) => (
      <tr
        key={post.id}
        className={`border-b border-gray-200 ${
          post.post_date === todayDateString ? "bg-yellow-200" : ""
        }`}
      >
        <td className="py-4 px-6">{post.post_date}</td>
        <td className="py-4 px-6">{post.sampler_title}</td>
        <td className="py-4 px-6">
          {post.sampled_title + " - " + post.sampled_artist}
        </td>
        <td className="py-4 px-6">
          {post.deleting ? (
            <div className="flex justify-center items-center">
              <div
                className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              ></div>
            </div>
          ) : (
            <button
              className="text-2xl"
              onClick={() => handleSongDelete(post.id)}
              disabled={post.deleting}
            >
              🗑️
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto px-4 text-center">
      <div className="overflow-auto max-h-96">
        <table className="table-auto w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg text-center">
          <thead>
            <tr>
              <th className="py-4 px-6">Post Date</th>
              <th className="py-4 px-6">Sampler Song</th>
              <th className="py-4 px-6">Original Song</th>
              <th className="py-4 px-6">Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="py-8">
                  <div className="flex justify-center items-center">
                    <div
                      className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                      role="status"
                    ></div>
                  </div>
                </td>
              </tr>
            ) : (
              renderSongPosts()
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
