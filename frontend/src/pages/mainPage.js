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
  const [isPlayingSampler, setIsPlayingSampler] = useState(false);
  const [sampledSongAudio, setSampledSongAudio] = useState(new Audio());
  const [samplerSongAudio, setSamplerSongAudio] = useState(new Audio());
  const [userAnswer, setUserAnswer] = useState("");
  const [gameAnswer, setGameAnswer] = useState("");
  const [correct, setCorrect] = useState(false);
  const [tryCount, setTryCount] = useState(4);
  const [triedSongs, setTriedSongs] = useState([]);

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
          setTriedSongs([]);
          setGameAnswer(
            foundSong.sampler_title + "-" + foundSong.sampler_artist
          );
        }
        setLoading(false); // Update loading state when data fetching is complete
      })
      .catch((err) => {
        setLoading(false); // Update loading state in case of an error
      });
  }, []);

  const checkSong = () => {
    if (gameAnswer == userAnswer) {
      setCorrect(true);
    } else {
      setTryCount(tryCount - 1);
      console.log(tryCount);
      if (tryCount == 0) {
        console.log("stop");
      }
    }
  };

  const handleSamplerSearchResultsChange = (results) => {
    console.log(results);
    console.log(gameInstance);
    setUserAnswer(results.name + "-" + results.artist);
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

  const handleSamplerButtonClick = () => {
    if (!isPlayingSampler) {
      // If the audio is not currently playing
      setIsPlayingSampler(true); // Restart the audio from the beginning
      samplerSongAudio.play(); // Play the audio
      samplerSongAudio.onended = () => {
        setIsPlayingSampler(false); // Set state to indicate audio playback has ended
      };
    } else {
      // If the audio is currently playing
      setIsPlayingSampler(false); // Set state to indicate audio playback has ende
      // Create an Audio object
      samplerSongAudio.pause(); // Pause the audio
    }
  };

  if (loading) {
    return <Loading></Loading>; // Display a loading indicator while fetching data
  } else if (!gameInstance || Object.keys(gameInstance).length === 0) {
    return <NoSong></NoSong>; // Display message when song is empty
  }

  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-orange-500 animate-gradient-x min-h-screen lg:justify-center lg:items-center sm:flex sm:justify-center sm:items-center">
      <div className="container mx-auto px-4 text-center">
        <header className="text-6xl font-bold mb-2 text-white">
          samplele.
        </header>
        <h2 className="text-white text-lg   lg:text-xl md:text-xl font-bold mb-2 ">
          listen to the sample and try and guess which rap song samples it.
        </h2>
        <h2 className="text-red-600 text-2xl font-bold mb-4">
          {tryCount === 0 && !correct && "ah unlucky, try again tomorrow"}
          {tryCount === 1 &&
            !correct &&
            "if you don't get this with the album..."}
          {tryCount === 2 &&
            !correct &&
            "not great at this are you huh, heres the artist"}
          {tryCount === 3 &&
            !correct &&
            "wrong, lemme give you the year of the song to help"}
          {tryCount === 4 && ""}
          {correct && "correct!, nice one come back tomorrow to try again"}
        </h2>

        {!(correct || tryCount == 0) && (
          <div className="container mx-auto 2xl:px-96 xl:px-64 lg:px-32 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
              <SearchBar
                onSearchResultsChange={handleSamplerSearchResultsChange}
              />
              <div className="grid grid-cols-2 gap-4">
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
          </div>
        )}
        <div className="flex justify-center items-center my-3">
          <div className="flex">
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-white transition-opacity ${
                tryCount < 1 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-white transition-opacity ${
                tryCount < 2 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-white transition-opacity ${
                tryCount < 3 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-white transition-opacity ${
                tryCount < 4 ? "opacity-50" : ""
              }`}
            ></div>
          </div>
        </div>

        <div className="container mx-auto 2xl:px-96 xl:px-64 lg:px-32 md:px-0">
          <div className="md:col-span-1 sm:col-span-1 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 flex flex-col md:flex-row justify-center items-center">
            <div className="flex justify-center items-center md:block sm:block">
              <div className="relative bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg w-48 h-48">
                <img
                  src={gameInstance.sampler_artwork}
                  alt="Sampler Artwork"
                  className={`object-cover w-full h-full rounded-3xl ${
                    correct || tryCount < 1 ? "" : "blur-xl"
                  }`}
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

            <div className=" font-bold text-center text-white text-left">
              <p
                className={`text-xl pb-4 ${
                  tryCount < 1 || correct ? "" : "blur-sm"
                }`}
              >
                {gameInstance.sampler_title}
              </p>
              <p
                className={`text-lg pb-4 ${
                  tryCount < 2 || correct ? "" : "blur-sm"
                }`}
              >
                {gameInstance.sampler_album}
              </p>
              <p
                className={`text-lg pb-4 ${
                  tryCount < 3 || correct ? "" : "blur-sm"
                }`}
              >
                {gameInstance.sampler_artist}
              </p>
              <p
                className={`text-lg pb-4 ${
                  tryCount < 4 || correct ? "" : "blur-sm"
                }`}
              >
                {gameInstance.sampler_year}
              </p>
            </div>
          </div>
          {correct ||
            (tryCount < 1 && (
              <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg grid justify-center items-center">
                <div className=" font-bold col-span-1 text-center text-white md:text-left">
                  <p
                    className={`text-xl pb-4 ${
                      tryCount < 1 || correct ? "" : "blur-sm"
                    }`}
                  >
                    {gameInstance.sampled_title}
                  </p>
                  <p
                    className={`text-lg pb-4 ${
                      tryCount < 3 || correct ? "" : "blur-sm"
                    }`}
                  >
                    {gameInstance.sampled_artist}
                  </p>
                  <p
                    className={`text-lg pb-4 ${
                      tryCount < 4 || correct ? "" : "blur-sm"
                    }`}
                  >
                    {gameInstance.sampled_year}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
