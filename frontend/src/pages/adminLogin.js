import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/searchBar";
import DatePicker from "react-datepicker";
import SongTable from "../components/songTable";
import "react-datepicker/dist/react-datepicker.css";

function AdminPage() {
  const [formData, setFormData] = useState({
    sampler_title: "",
    sampled_title: "",
    sampler_album: "",
    sampled_album: "",
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);

  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/songposts"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/songposts"
      )
      .then((response) => {
        let disabledDates = [];
        for (let i = 0; i < response.data.length; i++) {
          disabledDates.push(new Date(response.data[i].post_date));
        }
        setDisabledDates(disabledDates);
      })
      .catch((error) => {
        console.error("Error fetching disabled dates:", error);
      });
  }, []);

  const filterDisabledDates = (date) => {
    const dateString = date.toDateString();

    return !disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === dateString
    );
  };

  const handleSamplerSearchResultsChange = (results) => {
    if (results) {
      setSamplerSong(results);
      setFormData((prevFormData) => ({
        ...prevFormData,
        sampler_title: results.name || "",
        sampler_album: results.album || "",
        sampler_artist: results.artist || "",
        sampler_artwork: results.artwork || "",
        sampler_audio: results.previewUrl || "",
        sampler_year: results.releaseDate
          ? results.releaseDate.substring(0, 4)
          : "",
      }));
    } else {
      // Handle the case when results is null or undefined
      setSamplerSong({});
      setFormData((prevFormData) => ({
        ...prevFormData,
        sampler_title: "",
        sampler_album: "",
        sampler_artist: "",
        sampler_artwork: "",
        sampler_audio: "",
        sampler_year: "",
      }));
    }
  };

  const handleSampleSearchResultsChange = (results) => {
    if (results) {
      setSampledSong(results);
      setFormData((prevFormData) => ({
        ...prevFormData,
        sampled_title: results.name || "",
        sampled_album: results.album || "",
        sampled_artist: results.artist || "",
        sampled_artwork: results.artwork || "",
        sampled_audio: results.previewUrl || "",
        sampled_year: results.releaseDate
          ? results.releaseDate.substring(0, 4)
          : "",
      }));
    } else {
      setSampledSong({});
      setFormData((prevFormData) => ({
        ...prevFormData,
        sampled_title: "",
        sampled_album: "",
        sampled_artist: "",
        sampled_artwork: "",
        sampled_audio: "",
        sampled_year: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "sampler_title",
      "sampled_title",
      "sampler_album",
      "sampled_album",
      "sampler_artist",
      "sampled_artist",
      "sampler_artwork",
      "sampled_artwork",
      "sampler_audio",
      "sampled_audio",
      "sampler_year",
      "sampled_year",
      "post_date",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`The following fields are required: ${missingFields.join(", ")}`);
      return;
    }

    try {
      await axios.post(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/songposts/`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/songposts/`,
        formData
      );
      setFormData({
        sampler_title: "",
        sampled_title: "",
        sampler_album: "",
        sampled_album: "",
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

      alert("Song added successfully");
      window.location.reload();
    } catch (error) {
      alert(error + " date could be taken");
    }
  };

  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-purple-500 animate-gradient-xy min-h-screen">
      <div className="lg:flex lg:justify-center lg:items-center md:flex md:justify-center md:items-center">
        <div className="container mx-auto px-4 text-center">
          <header className="text-6xl font-bold mb-2 text-white">
            Admin Page.
          </header>
          <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
              <header className="text-2xl font-bold mb-2 text-white">
                Original Song.
              </header>
              <SearchBar
                onSearchResultsChange={handleSampleSearchResultsChange}
              />
            </div>
            <div className="lg:col-span-1 md:col-span-1 sm:col-span-1">
              <header className="text-2xl font-bold mb-2 text-white">
                Sampler Song.
              </header>
              <SearchBar
                onSearchResultsChange={handleSamplerSearchResultsChange}
              />
            </div>
            <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-3xl shadow-lg text-center">
              <ul className="font-bold text-xl py-4">
                <li>{sampledSong.name}</li>
                <li>{sampledSong.artist}</li>
                <li>{sampledSong.album}</li>
                <li style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={sampledSong.artwork}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                    alt="alt.png"
                  />
                </li>
                <li style={{ display: "flex", justifyContent: "center" }}>
                  <audio src={sampledSong.previewUrl} controls={true} />
                </li>
                <li>{sampledSong.genre}</li>
                <li>
                  {new Date(sampledSong.releaseDate).toLocaleDateString()}
                </li>
              </ul>
            </div>

            <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-3xl shadow-lg text-center">
              <ul className="font-bold text-xl py-4">
                <li>{samplerSong.name}</li>
                <li>{samplerSong.artist}</li>
                <li>{samplerSong.album}</li>
                <li style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={samplerSong.artwork}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                    alt="alt.png"
                  />
                </li>
                <li style={{ display: "flex", justifyContent: "center" }}>
                  <audio src={samplerSong.previewUrl} controls={true} />
                </li>
                <li>{samplerSong.genre}</li>
                <li>
                  {new Date(samplerSong.releaseDate).toLocaleDateString()}
                </li>
              </ul>
            </div>

            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                const localDateString = new Date(
                  date.getTime() - date.getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .split("T")[0];
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  post_date: localDateString,
                }));
              }}
              minDate={new Date()}
              filterDate={filterDisabledDates}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className="grid-cols-2 w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-1"
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
      <SongTable></SongTable>
    </div>
  );
}

export default AdminPage;
