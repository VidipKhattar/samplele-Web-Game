import React, { useState } from "react";
import axios from "axios";
import AdminPage from "./adminLogin";

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        process.env.NODE_ENV === "production"
          ? `${process.env.REACT_APP_API_BASE_URL_PROD}/login/`
          : `${process.env.REACT_APP_API_BASE_URL_DEV}/login/`,
        credentials
      );
      setMessage("Login successful");
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true");
      onLogin();
    } catch (error) {
      setMessage("Incorrect username or password");
    } finally {
      setLoading(false);
    }
  };

  if (localStorage.getItem("loggedIn") === "true") {
    return <AdminPage />;
  }

  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-purple-500 animate-gradient-x min-h-screen lg:flex lg:justify-center lg:items-center md:flex md:justify-center md:items-center">
      <div className=" px-4 text-center">
        <h2 className="text-3xl sm:text-6xl font-bold mb-2 text-white ">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="">
            <input
              type="text"
              className="container bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 my-4 rounded-xl shadow-lg text-center"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Username"
            />
            <input
              type="password"
              className="container bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 my-2 rounded-xl shadow-lg text-center"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <button
            className="container bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg p-2  rounded-xl shadow-lg my-5 font-bold text-white relative"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              ></div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        {message && (
          <p className="text-4xl font-bold mb-2 text-white animate-pulse ">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
