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
    sampler_audio_youtube_link: "",
    sampler_audio_start_time: "",
    sampled_audio: "",
    sampled_audio_youtube_link: "",
    sampled_audio_start_time: "",
    sampler_year: "",
    sampled_year: "",
    post_date: "",
  });
  const [samplerSong, setSamplerSong] = useState({});
  const [sampledSong, setSampledSong] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const [ytVideo, setYTVideo] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSampler, setLoadingSampler] = useState(false);
  const [ytVideoSampler, setYTVideoSampler] = useState("");
  const [timeValueSampler, setTimeValueSampler] = useState("");

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
    return !disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );
  };

  useEffect(() => {
    if (ytVideo && timeValue) {
      setLoading(true);
      processAndUpdateFormData(ytVideo, timeValue)
        .then((res) => {
          setSampledSong((prevSampledSong) => ({
            ...prevSampledSong,
            previewUrl: res.presigned_url, // Assuming the property name is previewUrl
          }));
          setFormData((prevFormData) => ({
            ...prevFormData,
            sampled_title: formData.sampled_title
              ? prevFormData.sampled_title
              : res.title,
            sampled_audio: res.title,
          }));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error processing and updating form data:", error);
          setLoading(false);
        });
    }
  }, [ytVideo, timeValue]);

  useEffect(() => {
    if (ytVideoSampler && timeValueSampler) {
      setLoadingSampler(true);
      processAndUpdateFormData(ytVideoSampler, timeValueSampler)
        .then((res) => {
          setSamplerSong((prevSamplerSong) => ({
            ...prevSamplerSong,
            previewUrl: res.presigned_url,
          }));
          setFormData((prevFormData) => ({
            ...prevFormData,
            sampler_audio: res.title,
          }));
          setLoadingSampler(false);
        })
        .catch((error) => {
          console.error("Error processing and updating form data:", error);
          setLoadingSampler(false);
        });
    }
  }, [ytVideoSampler, timeValueSampler]);

  const processAndUpdateFormData = async (ytVideoVar, timeValueVar) => {
    try {
      const post_response = await axios.post(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/youtube/"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/youtube/",
        { ytVideoVar, timeValueVar }
      );

      const { title } = post_response.data;
      const ending = "/youtube/?title=" + encodeURIComponent(title);
      const get_response = await axios.get(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + ending
          : process.env.REACT_APP_API_BASE_URL_DEV + ending
      );
      return { presigned_url: get_response.data.presigned_url, title: title };
    } catch (error) {
      console.error("Error converting YouTube video:", error);
    }
  };

  const handleYTChange = async (event) => {
    const { name, value } = event.target;
    if (name.includes("youtubeSong")) {
      const youtubeUrlPattern =
        /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
      if (youtubeUrlPattern.test(value)) {
        if (name == "youtubeSong") {
          setYTVideo(value);
        } else if (name == "youtubeSongSampler") {
          setYTVideoSampler(value);
        }
      }
    } else if (name.includes("time")) {
      const timePattern = /^\d+:\d{2}$/;
      if (timePattern.test(value)) {
        const [minutes, seconds] = value.split(":").map(Number);
        const totalTimeInSeconds = minutes * 60 + seconds;
        if (name == "time") {
          setTimeValue(totalTimeInSeconds);
        } else if (name == "timeSampler") {
          setTimeValueSampler(totalTimeInSeconds);
        }
      }
    }
  };

  const handleSamplerSearchResultsChange = (results) => {
    const { name, album, artist, artwork, previewUrl, releaseDate } =
      results || {};

    setSamplerSong(results || {});

    setFormData((prevFormData) => ({
      ...prevFormData,
      sampler_title: name ?? "",
      sampler_album: album ?? "",
      sampler_artist: artist ?? "",
      sampler_artwork: artwork ?? "",
      sampler_audio: previewUrl ?? "",
      sampler_year: releaseDate?.substring(0, 4) ?? "",
    }));
  };

  const handleSampleSearchResultsChange = (results) => {
    const { name, album, artist, artwork, previewUrl, releaseDate } =
      results || {};

    setSampledSong(results || {});

    setFormData((prevFormData) => ({
      ...prevFormData,
      sampled_title: name ?? "",
      sampled_album: album ?? "",
      sampled_artist: artist ?? "",
      sampled_artwork: artwork ?? "",
      sampled_audio: previewUrl ?? "",
      sampled_year: releaseDate?.substring(0, 4) ?? "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingSampler(true);

    const requiredFields = [
      "sampler_title",
      "sampled_title",
      "sampler_audio",
      "sampled_audio",
      "post_date",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`The following fields are required: ${missingFields.join(", ")}`);
      setLoading(false);
      setLoadingSampler(false);
      return;
    }

    try {
      await axios.post(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/songposts/`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/songposts/`,
        formData
      );
      setLoading(false);
      setLoadingSampler(false);
      window.location.reload();
    } catch (error) {
      alert(error + " date could be taken");
      setLoading(false);
      setLoadingSampler(false);
    }
  };

  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-purple-500 animate-gradient-xy min-h-screen">
      <div className="lg:flex lg:justify-center lg:items-center md:flex md:justify-center md:items-center">
        <div className="container mx-auto px-4 text-center">
          <header className="text-6xl font-bold mb-2 text-white">
            Admin Page.
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
                <li>
                  {sampledSong.genre +
                    " - " +
                    new Date(sampledSong.releaseDate).toLocaleDateString()}
                </li>
                <input
                  placeholder="Youtube song"
                  onChange={handleYTChange}
                  name="youtubeSong"
                  className="text-gray-600 w-5/6 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg py-1 m-2"
                  disabled={loading || process.env.NODE_ENV === "production"}
                ></input>
                <input
                  placeholder="Time"
                  onChange={handleYTChange}
                  name="time"
                  className="text-gray-600 w-5/6 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg py-1 m-2"
                  disabled={loading || process.env.NODE_ENV === "production"}
                ></input>
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
                <li>
                  {samplerSong.genre +
                    " - " +
                    new Date(samplerSong.releaseDate).toLocaleDateString()}
                </li>
                <input
                  placeholder="Youtube song"
                  onChange={handleYTChange}
                  name="youtubeSongSampler"
                  className="text-gray-600 w-5/6 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg py-1 m-2"
                  disabled={
                    loadingSampler || process.env.NODE_ENV === "production"
                  }
                ></input>
                <input
                  placeholder="Time"
                  onChange={handleYTChange}
                  name="timeSampler"
                  className="text-gray-600 w-5/6 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg py-1 m-2"
                  disabled={
                    loadingSampler || process.env.NODE_ENV === "production"
                  }
                ></input>
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
              disabled={loading || loadingSampler}
            >
              {loading || loadingSampler ? (
                <div
                  className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status"
                ></div>
              ) : (
                "Add samplele"
              )}
            </button>
          </div>
        </div>
      </div>
      <SongTable></SongTable>
    </div>
  );
}

export default AdminPage;
