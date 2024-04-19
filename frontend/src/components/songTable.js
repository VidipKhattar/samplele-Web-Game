import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  // Your existing state and functions

  const [songPosts, setSongPosts] = useState([]);

  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/songposts"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/songposts"
      )
      .then((response) => {
        setSongPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching song posts:", error);
      });
  }, []);

  const handleSongDelete = (e) => {
    console.log(e.target.value);
    axios
      .delete(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD +
              "/songposts/" +
              e.target.value
          : process.env.REACT_APP_API_BASE_URL_DEV +
              "/songposts/" +
              e.target.value
      )
      .then((response) => {
        alert("Song successfully deleted");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting song posts:", error);
      });
  };

  const renderSongPosts = () => {
    return songPosts.map((post) => (
      <tr key={post.id} className="border-b border-gray-200">
        <td className="py-4 px-6">{post.post_date}</td>
        <td className="py-4 px-6">{post.sampler_title}</td>
        <td className="py-4 px-6">{post.sampled_title}</td>
        <td className="py-4 px-6">
          <button
            className="text-2xl"
            onClick={handleSongDelete}
            value={post.id}
          >
            🗑️
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto px-4 text-center">
      {/* Your existing components */}
      <div className="overflow-auto max-h-96">
        <table className="table-auto w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg text-center">
          <thead>
            <tr>
              <th className="py-4 px-6">Post Date</th>
              <th className="py-4 px-6">Sampler Title</th>
              <th className="py-4 px-6">Sampled Title</th>
              <th className="py-4 px-6">Delete</th>
            </tr>
          </thead>
          <tbody>{renderSongPosts()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
