import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AdminPage() {
  const [songPosts, setSongPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({});
  const [disabledDates, setDisabledDates] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [datePickerLoading, setDatePickerLoading] = useState({}); // New state for individual loading status

  useEffect(() => {
    axios
      .get(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/songposts`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/songposts`
      )
      .then((response) => {
        let disabledDates = [];
        for (let i = 0; i < response.data.length; i++) {
          disabledDates.push(new Date(response.data[i].post_date));
        }
        setDisabledDates(disabledDates);

        response.data.sort((a, b) => {
          let dateA = new Date(a.post_date);
          let dateB = new Date(b.post_date);
          return dateA - dateB;
        });
        setSongPosts(response.data);
        setLoading(false);

        // Find the first available (non-disabled) date
        const today = new Date();
        let availableDate = today;
        while (
          disabledDates.some(
            (date) => date.toDateString() === availableDate.toDateString()
          )
        ) {
          availableDate.setDate(availableDate.getDate() + 1);
        }
        setStartDate(availableDate);
      })
      .catch((error) => {
        console.error("Error fetching song posts:", error);
        setLoading(false);
      });
  }, []);

  const filterDisabledDates = (date) => {
    return !disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );
  };

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
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting song post:", error);
      });
  };

  const handleDateChange = (id, date) => {
    setDatePickerLoading((prevLoading) => ({
      ...prevLoading,
      [id]: true,
    }));

    setSelectedDates((prevDates) => ({
      ...prevDates,
      [id]: date,
    }));

    const processUrl = (url) => {
      const start = "https://samplele-bucket.s3.amazonaws.com/songs/";
      if (url.startsWith(start)) {
        const strippedUrl = url.substring(start.length).split("?")[0];
        return decodeURIComponent(strippedUrl);
      }
      return url;
    };

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_BASE_URL_PROD
        : process.env.REACT_APP_API_BASE_URL_DEV;

    axios
      .get(`${baseUrl}/songposts/${id}`)
      .then((response) => {
        const { sampled_audio, sampler_audio, post_date } = response.data;
        const localDateString = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        response.data.sampled_audio = processUrl(sampled_audio);
        response.data.sampler_audio = processUrl(sampler_audio);
        response.data.post_date = localDateString;
        repostSong(response.data, id);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error fetching song post:", error);
        setDatePickerLoading((prevLoading) => ({
          ...prevLoading,
          [id]: false,
        }));
      });
  };

  const repostSong = async (songPostData, id) => {
    try {
      await axios.post(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/songposts/`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/songposts/`,
        songPostData
      );
      setDatePickerLoading((prevLoading) => ({
        ...prevLoading,
        [id]: false,
      }));
    } catch (error) {
      alert(error);
      setDatePickerLoading((prevLoading) => ({
        ...prevLoading,
        [id]: false,
      }));
    }
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
        <td className="py-4 px-6">
          {datePickerLoading[post.id] ? (
            <div className="flex justify-center items-center">
              <div
                className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              ></div>
            </div>
          ) : (
            <DatePicker
              selected={selectedDates[post.id] || null}
              onChange={(date) => handleDateChange(post.id, date)}
              //minDate={new Date()}
              openToDate={startDate} // Set the initial month
              //filterDate={filterDisabledDates}
              dateFormat="yyyy-MM-dd"
              placeholderText="date"
              className="grid-cols-2 w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-1"
              popperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 10],
                    },
                  },
                ],
              }}
            />
          )}
        </td>
        <td className="py-4 px-6">
          {post.sampler_title + " - " + post.sampler_artist}
        </td>
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
      <div className="overflow-auto ">
        <table className="table-auto w-full bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg text-center">
          <thead>
            <tr>
              <th className="py-4 px-6">Post Date</th>
              <th className="py-4 px-6">Repost</th>
              <th className="py-4 px-6">Sampler Song</th>
              <th className="py-4 px-6">Original Song</th>
              <th className="py-4 px-6">Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8">
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
