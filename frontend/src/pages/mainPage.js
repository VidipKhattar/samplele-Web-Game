import React, { useState, useEffect } from "react";
import playButton from "../playbutton.svg";
import pauseButton from "../pausebutton.svg";
import "../App.css";
import axios from "axios";
import SearchBar from "../components/searchBar";
import Loading from "./loading";
import NoSong from "./noSong";

function MainPage() {
  const [gameInstance, setGameInstance] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [sampledSongAudio, setSampledSongAudio] = useState(new Audio());
  const [samplerSongAudio, setSamplerSongAudio] = useState(new Audio());
  const [userAnswer, setUserAnswer] = useState({});
  const [tryCount, setTryCount] = useState(4);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    axios
      .get("http://127.0.0.1:8000/songposts")
      .then((res) => {
        let data = res.data;
        const foundSong = res.data.find((item) => item.post_date === today);
        if (foundSong) {
          setGameInstance(foundSong);
          setSampledSongAudio(new Audio(foundSong.sampled_audio));
          setSamplerSongAudio(new Audio(foundSong.sampler_audio));
        }
        setLoading(false); // Update loading state when data fetching is complete
      })
      .catch((err) => {
        setLoading(false); // Update loading state in case of an error
      });
  }, []);

  const checkSong = () => {
    setTryCount(tryCount - 1);
    console.log(tryCount);
    if (tryCount == 0) {
      console.log("stop");
    }
  };

  const handleSamplerSearchResultsChange = (results) => {
    console.log(results);
    setUserAnswer(results);
  };

  const handleButtonClick = () => {
    if (!isPlayingSample) {
      // If the audio is not currently playing
      setIsPlayingSample(true); // Restart the audio from the beginning
      sampledSongAudio.play(); // Play the audio
      sampledSongAudio.onended = () => {
        setIsPlayingSample(false); // Set state to indicate audio playback has ended
      };
    } else {
      // If the audio is currently playing
      setIsPlayingSample(false); // Set state to indicate audio playback has ende
      // Create an Audio object
      sampledSongAudio.pause(); // Pause the audio
    }
  };

  if (loading) {
    return <Loading></Loading>; // Display a loading indicator while fetching data
  } else if (!gameInstance || Object.keys(gameInstance).length === 0) {
    return <NoSong></NoSong>; // Display message when song is empty
  }

  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-orange-500 animate-gradient-x min-h-screen lg:flex lg:justify-center lg:items-center  md:flex md:justify-center md:items-center">
      <div className="container mx-auto px-4 text-center">
        <header className="text-6xl font-bold mb-2 text-white">
          samplele.
        </header>
        <h2 className="text-white text-xl font-bold mb-4">
          listen to the sample and try and guess which rap song samples it.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-10 sm:grid-cols-1 gap-4">
          <div className="lg:col-span-6 md:col-span-6 sm:col-span-4 h-full">
            <SearchBar
              onSearchResultsChange={handleSamplerSearchResultsChange}
            ></SearchBar>
          </div>
          <div className="md:col-span-4 sm:col-span-4 grid grid-cols-2 gap-4">
            <button
              className="bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg w-full font-bold text-white"
              onClick={checkSong}
              type="button"
            >
              Lock In
            </button>
            <button
              className="flex items-center justify-center bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg hover:bg-opacity-50 transition-colors duration-300 "
              type="button"
              onClick={handleButtonClick}
            >
              {isPlayingSample ? (
                <img src={pauseButton} alt="Logo" />
              ) : (
                <img src={playButton} alt="Logo" />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center my-4">
          <div className="flex">
            <div
              className={`w-4 h-4 rounded-full mx-1 bg-zinc-600 ${
                tryCount < 1 ? "bg-opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-4 h-4 rounded-full mx-1 bg-zinc-600 ${
                tryCount < 2 ? "bg-opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-4 h-4 rounded-full mx-1 bg-zinc-600 ${
                tryCount < 3 ? "bg-opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-4 h-4 rounded-full mx-1 bg-zinc-600 ${
                tryCount < 4 ? "bg-opacity-50" : ""
              }`}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <div className="md:col-span-2 sm:col-span-1 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 flex flex-col md:flex-row justify-center items-center">
            <div className="flex justify-center items-center md:block sm:block">
              <div className="relative bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg w-48 h-48">
                <img
                  src={gameInstance.sampler_artwork}
                  alt="Sampler Artwork"
                  className="object-cover w-full h-full rounded-3xl"
                />
                <button
                  className="absolute flex justify-center items-center bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-full shadow-lg "
                  type="button"
                >
                  <img
                    src={playButton}
                    alt="Play Button"
                    className="w-12 h-12"
                  />
                </button>
              </div>
            </div>

            <div className="col-span-1 text-center md:text-left">
              <p className="font-bold text-2xl py-4">
                {gameInstance.sampler_title}
              </p>
              <p className="text-xl pb-4">{gameInstance.sampler_album}</p>
              <p className="text-xl pb-4">{gameInstance.sampler_artist}</p>
              <p className="text-xl pb-4">{gameInstance.sampler_year}</p>
            </div>
          </div>

          <div className="md:col-span-1 sm:col-span-1 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 flex flex-col md:flex-row justify-center items-center">
            <div className="flex justify-center items-center md:block sm:block">
              <div className="relative bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg w-48 h-48">
                <img
                  src={gameInstance.sampled_artwork}
                  alt="Sampler Artwork"
                  className="object-cover w-full h-full rounded-3xl"
                />
                <button
                  className="absolute flex justify-center items-center bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-full shadow-lg "
                  type="button"
                >
                  <img
                    src={playButton}
                    alt="Play Button"
                    className="w-12 h-12"
                  />
                </button>
              </div>
            </div>

            <div className="col-span-1 text-center md:text-left">
              <p className="font-bold text-2xl py-4">
                {gameInstance.sampled_title}
              </p>
              <p className="text-xl pb-4 ">{gameInstance.sampled_album}</p>
              <p className="text-xl pb-4">{gameInstance.sampled_artist}</p>
              <p className="text-xl pb-4">{gameInstance.sampled_year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
