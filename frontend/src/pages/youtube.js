import React, { useState, useEffect } from "react";
import axios from "axios";

const YoutubeToMp3Converter = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const convertToMp3 = async () => {
    setIsLoading(true);
    try {
      console.log(youtubeUrl);
      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD + "/youtube/"
          : process.env.REACT_APP_API_BASE_URL_DEV + "/youtube/",
        { youtubeUrl }
      );
      setAudioUrl(response.data.audio_file);
    } catch (error) {
      console.error("Error converting YouTube video:", error);
    }
    setIsLoading(false);
  };

  const togglePlay = () => {
    setIsPlaying((prevState) => !prevState);
  };

  useEffect(() => {
    if (audioUrl && isPlaying) {
      // Play audio when audioUrl is available and isPlaying is true
      const audio = new Audio(audioUrl);
      audio.play();
      return () => {
        // Clean up audio when component unmounts or audioUrl changes
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [audioUrl, isPlaying]);

  return (
    <div>
      <input
        type="text"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Enter YouTube video URL"
      />
      <button onClick={convertToMp3} disabled={isLoading}>
        {isLoading ? "Converting..." : "Convert to MP3"}
      </button>
      <button onClick={togglePlay} disabled={!audioUrl}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default YoutubeToMp3Converter;
