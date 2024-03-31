import React, { useState } from "react";
import axios from "axios";
import SearchBar from "../components/searchBar"; // Import the SearchBar component

function AdminPage() {
  const [formData, setFormData] = useState({
    sampler_title: "",
    sampled_title: "",
    sampler_artist: "",
    sampled_artist: "",
    sampler_artwork: "",
    sampled_artwork: "",
    sampler_audio: "",
    sampled_audio: "",
    sampler_year: "",
    sampled_year: "",
    post_date: "",
  });
  const [samplerSong, setSamplerSong] = useState({});
  const [sampledSong, setSampledSong] = useState({});

  // Callback function to update search results
  const handleSamplerSearchResultsChange = (results) => {
    setSamplerSong(results);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sampler_title: results.name,
      sampler_artist: results.artist,
      sampler_artwork: results.artwork,
      sampler_audio: results.previewUrl,
      sampler_year: results.releaseDate.substring(0, 4),
    }));
  };

  const handleSampledSearchResultsChange = (results) => {
    setSampledSong(results);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sampled_title: results.name,
      sampled_artist: results.artist,
      sampled_artwork: results.artwork,
      sampled_audio: results.previewUrl,
      sampled_year: results.releaseDate.substring(0, 4),
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post song details to backend
      const response = await axios.post(
        "http://127.0.0.1:8000/songposts/",
        formData
      );
      console.log("Song added successfully:", response.data);
      // Reset form after successful submission
      setFormData({
        sampler_title: "",
        sampled_title: "",
        sampler_artist: "",
        sampled_artist: "",
        sampler_artwork: "",
        sampled_artwork: "",
        sampler_audio: "",
        sampled_audio: "",
        sampler_year: "",
        sampled_year: "",
        post_date: "",
      });
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-purple-500 animate-gradient-x min-h-screen lg:flex lg:justify-center lg:items-center md:flex md:justify-center md:items-center">
      <div className="container mx-auto px-4 text-center">
        <header className="text-6xl font-bold mb-2 text-white">
          Admin Page.
        </header>
        <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
            <header className="text-2xl font-bold mb-2 text-white">
              Sampler Song.
            </header>
            <SearchBar
              onSearchResultsChange={handleSamplerSearchResultsChange}
            />
          </div>
          <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
            <header className="text-2xl font-bold mb-2 text-white">
              Sampled Song.
            </header>
            <SearchBar
              onSearchResultsChange={handleSampledSearchResultsChange}
            />
          </div>
          <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-3xl shadow-lg ">
            <ul className="font-bold text-xl t py-4">
              <li>{samplerSong.name}</li>
              <li>{samplerSong.artist}</li>
              <li>{samplerSong.album}</li>
              <li>
                <img src={samplerSong.artwork} />
              </li>
              <li>
                <audio src={samplerSong.previewUrl} controls={true} />
              </li>
              <li>{samplerSong.genre}</li>
              <li>{samplerSong.releaseDate}</li>
            </ul>
          </div>
          <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-3xl shadow-lg ">
            <ul className="font-bold text-xl t py-4">
              <li>{sampledSong.name}</li>
              <li>{sampledSong.artist}</li>
              <li>{sampledSong.album}</li>
              <li>
                <img src={sampledSong.artwork} />
              </li>
              <li>
                <audio src={sampledSong.previewUrl} controls={true} />
              </li>
              <li>{sampledSong.genre}</li>
              <li>{sampledSong.releaseDate}</li>
            </ul>
          </div>
          <input
            type="date"
            name="post_date"
            placeholder="date of game"
            className="grid-cols-2 w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-1"
            value={formData.post_date}
            onChange={handleChange}
          />
          <button
            className="bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-10 w-full font-bold text-white"
            type="button"
            onClick={handleSubmit}
          >
            Lock In
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
