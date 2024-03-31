import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

const SearchBar = ({ onSearchQueryChange, onSearchResultsChange }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [audioSrc, setAudioSrc] = useState("");

  const handleChange = async (event) => {
    const value = event.target.value;

    setQuery(value);

    // Fetch autocomplete suggestions from iTunes API
    try {
      const response = await axios.get(
        `https://itunes.apple.com/search?term=${value}&entity=song&limit=5`
      );

      console.log(response.data.results);

      const tracks = response.data.results.map((result) => ({
        name: result.trackName,
        artist: result.artistName,
        previewUrl: result.previewUrl,
        artwork: result.artworkUrl100,
        album: result.collectionName,
        genre: result.primaryGenreName,
        releaseDate: result.releaseDate,
      }));

      // Filter out duplicates
      const uniqueTracks = tracks.filter(
        (track, index, self) =>
          index ===
          self.findIndex(
            (t) => t.name === track.name && t.artist === track.artist
          )
      );

      setSuggestions(uniqueTracks);
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  const handleSelect = (song) => {
    setQuery(`${song.name} - ${song.artist}`);
    console.log("Selected Track:", song);
    setAudioSrc(song.previewUrl);
    onSearchResultsChange(song);
    setSuggestions([]);
  };

  const handleClearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setAudioSrc("");
  };

  return (
    <div className="relative z-10">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for songs..."
        className="w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-1"
      />
      {query && (
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 focus:outline-none"
          onClick={handleClearSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 5.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 11-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      {audioSrc && <audio src={audioSrc} controls={false}></audio>}
      {query && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 z-20 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg">
          {suggestions.map((song, index) => (
            <li
              key={`${song.name}-${song.artist}-${index}`}
              onClick={() => handleSelect(song)}
              className={`cursor-pointer py-1 px-2 hover:text-white transition-colors duration-250 rounded ${
                index < suggestions.length - 1 ? "border-b border-black" : ""
              }`}
            >
              {song.name} - {song.artist}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
