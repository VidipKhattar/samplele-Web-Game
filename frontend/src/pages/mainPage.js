import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import playButton from "../playbutton.svg";
import pauseButton from "../pausebutton.svg";
import axios from "axios";
import SearchBar from "../components/searchBar";
import Loading from "./loading";
import NoSong from "./noSong";

function MainPage() {
  const [gameInstance, setGameInstance] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [isPlayingSampler, setIsPlayingSampler] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [sampledSongAudio, setSampledSongAudio] = useState(new Audio());
  const [samplerSongAudio, setSamplerSongAudio] = useState(new Audio());
  const [userAnswer, setUserAnswer] = useState("");
  const [gameAnswer, setGameAnswer] = useState("");
  const [correct, setCorrect] = useState(false);
  const [tryCount, setTryCount] = useState(4);
  const [triedSongs, setTriedSongs] = useState([]);
  const storedTries = Cookies.get("tries");
  const storedCorrect = Cookies.get("correct");
  const [countdown, setCountdown] = useState("");

  function midnightExpiration() {
    const currentDate = new Date();
    const timeUntilMidnight =
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
        0,
        0,
        0
      ) - currentDate;
    const expiresAtMidnight = new Date(
      currentDate.getTime() + timeUntilMidnight
    );
    return expiresAtMidnight;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow - now;
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date();
    const formattedDate =
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2);
    if (storedTries) {
      setTryCount(parseInt(storedTries));
    }
    if (storedCorrect) {
      setCorrect(storedCorrect === "true");
    }
    axios
      .get(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/songposts"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/songposts"
      )
      .then((res) => {
        const foundSong = res.data.find(
          (item) => item.post_date === formattedDate
        );
        if (foundSong) {
          setGameInstance(foundSong);
          setSampledSongAudio(new Audio(foundSong.sampled_audio));
          setSamplerSongAudio(new Audio(foundSong.sampler_audio));
          setTriedSongs([]);
          setGameAnswer(
            foundSong.sampler_title + "-" + foundSong.sampler_artist
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [storedCorrect, storedTries]);

  const checkSong = () => {
    if (triedSongs.includes(userAnswer)) {
      setIsRepeat(true);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
    } else if (gameAnswer === userAnswer) {
      setIsRepeat(false);
      setCorrect(true);
      handleSamplerButtonClick();
      Cookies.set("tries", tryCount.toString(), {
        expires: midnightExpiration(),
      });
      Cookies.set("correct", "true", { expires: midnightExpiration() });
    } else {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000);
      triedSongs.push(userAnswer);
      setTriedSongs(triedSongs);
      setTryCount(tryCount - 1);
      setIsRepeat(false);
      Cookies.set("tries", (tryCount - 1).toString(), {
        expires: midnightExpiration(),
      });
      Cookies.set("correct", "false", { expires: midnightExpiration() });
    }
  };

  const handleSamplerSearchResultsChange = (results) => {
    if (results) {
      setUserAnswer(results.name + "-" + results.artist);
    } else {
      setUserAnswer("");
    }
  };

  const handleButtonClick = () => {
    if (!isPlayingSample) {
      setIsPlayingSample(true);
      samplerSongAudio.pause();
      setIsPlayingSampler(false);
      sampledSongAudio.play();
      sampledSongAudio.onended = () => {
        setIsPlayingSample(false);
      };
    } else {
      setIsPlayingSample(false);
      sampledSongAudio.pause();
    }
  };

  const handleSamplerButtonClick = () => {
    if (!isPlayingSampler) {
      setIsPlayingSampler(true);
      sampledSongAudio.pause();
      setIsPlayingSample(false);
      samplerSongAudio.play();
      samplerSongAudio.onended = () => {
        setIsPlayingSampler(false);
      };
    } else {
      setIsPlayingSampler(false);
      samplerSongAudio.pause();
    }
  };

  if (loading) {
    return <Loading></Loading>;
  } else if (!gameInstance || Object.keys(gameInstance).length === 0) {
    return <NoSong></NoSong>;
  }

  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-orange-500 animate-gradient-x min-h-screen lg:justify-center lg:items-center sm:flex sm:justify-center sm:items-center ">
      <div className="container mx-auto px-4 text-center">
        <header className="text-6xl font-bold mb-2 text-gray-600	">
          samplele.
        </header>
        {tryCount < 4 ||
          (!correct && (
            <h2 className="text-gray-600 text-lg lg:text-xl md:text-xl font-bold mb-2">
              listen to the sample to try and guess which song samples it.
            </h2>
          ))}
        <h2 className="text-gray-600 text-4xl font-bold mb-4">
          {tryCount === 0 && !correct && !isRepeat && (
            <span className="animate-pulse text-black  ">
              unlucky, try again tomorrow
            </span>
          )}
          {tryCount === 1 && !correct && !isRepeat && (
            <span className="animate-pulse text-black  ">last chance.</span>
          )}
          {tryCount === 2 && !correct && !isRepeat && (
            <span className="animate-pulse text-black  ">
              not great at this are you.
            </span>
          )}
          {tryCount === 3 && !correct && !isRepeat && (
            <span className="animate-pulse text-black ">wrong.</span>
          )}
          {correct && !isRepeat && (
            <span className="animate-pulse text-green-500 text-6xl  duration-2000">
              correct
            </span>
          )}
          {isRepeat && (
            <span className="animate-flash-green text-black	duration-2000">
              already tried.
            </span>
          )}
        </h2>

        <div
          className={`container mx-auto 2xl:px-96 xl:px-64 lg:px-32 md:px-0  ${
            correct || tryCount < 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
            <SearchBar
              onSearchResultsChange={handleSamplerSearchResultsChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out ${
                  correct ? "bg-green-500" : "bg-opacity-50 bg-blue-500"
                } 
                ${isShaking ? "animate-shake bg-red-500" : ""}
                ${!userAnswer ? "pointer-events-none opacity-50" : ""} 
                backdrop-filter backdrop-blur-lg rounded-xl shadow-lg w-full font-bold text-white`}
                onClick={checkSong}
                type="button"
              >
                Lock In
              </button>

              <button
                className="flex items-center justify-center bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg hover:bg-opacity-50 transition-colors duration-300"
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

        <div className="flex justify-center items-center my-3">
          <div className="flex">
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-gray-600	 transition-opacity ${
                tryCount < 1 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-gray-600	 transition-opacity ${
                tryCount < 2 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-gray-600	 transition-opacity ${
                tryCount < 3 ? "opacity-50" : ""
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full mx-1 bg-gray-600	 transition-opacity ${
                tryCount < 4 ? "opacity-50" : ""
              }`}
            ></div>
          </div>
        </div>

        <div className="container mx-auto 2xl:px-96 xl:px-64 lg:px-32 md:px-0">
          <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 min-[520px]:grid-cols-2 flex flex-col md:flex-row justify-center items-center">
            <div className="flex justify-center items-center md:block sm:block">
              <div className="relative bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg w-48 h-48 flex justify-center items-center">
                <img
                  src={gameInstance.sampler_artwork}
                  alt="Sampler Artwork"
                  className={`object-cover w-full h-full rounded-3xl ${
                    correct || tryCount < 1 ? "" : "blur-xl"
                  }`}
                />
                {(correct || tryCount === 0) && (
                  <button
                    className="absolute bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-full shadow-lg hover:bg-opacity-55 duration-300 w-16 h-16 flex justify-center items-center"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    type="button"
                    onClick={handleSamplerButtonClick}
                  >
                    {isPlayingSampler ? (
                      <img src={pauseButton} alt="Pause" className="w-8 h-8" />
                    ) : (
                      <img src={playButton} alt="Play" className="w-8 h-8" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="font-bold text-center text-gray-600 sm:pl-4 min-[520px]:text-left">
              <p
                className={`text-5xl pb-2 ${
                  tryCount < 1 || correct
                    ? "animate-flash-green duration-2000"
                    : "blur-md "
                }`}
              >
                {gameInstance.sampler_title}
              </p>
              <p
                className={`text-xl pb-2 ${
                  tryCount < 2 || correct
                    ? "animate-flash-green duration-2000"
                    : "blur-sm"
                }`}
              >
                {gameInstance.sampler_album}
              </p>
              <p
                className={`text-lg pb-2 ${
                  tryCount < 3 || correct
                    ? "animate-flash-green duration-2000"
                    : "blur-sm"
                }`}
              >
                {gameInstance.sampler_artist}
              </p>
              <p
                className={`text-sm pb-2 ${
                  tryCount < 4 || correct
                    ? "animate-flash-green duration-2000"
                    : "blur-sm"
                }`}
              >
                {gameInstance.sampler_year}
              </p>
            </div>
          </div>
          <div
            className={`${
              correct || tryCount < 1
                ? "opacity-100 transition-opacity duration-500 ease-in"
                : "opacity-0"
            }`}
          >
            <div
              className={`grid grid-cols-4 gap-4 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 my-4 rounded-3xl shadow-lg justify-center items-center`}
            >
              <div className="col-span-1 flex justify-center items-center">
                <button
                  className="absolute bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-full shadow-lg hover:bg-opacity-55 duration-300 w-16 h-16 flex justify-center items-center"
                  type="button"
                  onClick={handleButtonClick}
                >
                  {isPlayingSample ? (
                    <img src={pauseButton} alt="Pause" className="w-8 h-8" />
                  ) : (
                    <img src={playButton} alt="Play" className="w-8 h-8" />
                  )}
                </button>
              </div>
              <div className="col-span-3 font-bold text-center text-gray-600 min-[520px]:text-left">
                <p
                  className={`text-3xl pb-2 ${
                    tryCount < 1 || correct ? "" : "blur-sm"
                  }`}
                >
                  {gameInstance.sampled_title}
                </p>
                <p
                  className={`text-xl pb-2 ${
                    tryCount < 3 || correct ? "" : "blur-sm"
                  }`}
                >
                  {gameInstance.sampled_artist}
                </p>
                <p
                  className={`text-lg pb-2 ${
                    tryCount < 4 || correct ? "" : "blur-sm"
                  }`}
                >
                  {gameInstance.sampled_year}
                </p>
              </div>
            </div>
            <p className="animate-bounce text-gray-600 font-bold text-lg ">
              come back tomorrow for a new song 👀👀👀
            </p>
            <p className="text-gray-600 font-bold text-lg animate-bounce  ">
              {countdown}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
