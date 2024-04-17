import React, { useState } from "react";
import axios from "axios";
import AdminPage from "./adminLogin";

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login/",
        credentials
      );
      setMessage("Login successful");
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true");
      onLogin();
    } catch (error) {
      setMessage("Incorrect username or password");
    }
  };

  // Check if user is already logged in
  if (localStorage.getItem("loggedIn") === "true") {
    return <AdminPage />;
  }

  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-purple-500 animate-gradient-x min-h-screen lg:flex lg:justify-center lg:items-center md:flex md:justify-center md:items-center">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-6xl font-bold mb-2 text-white ">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="">
            <input
              type="text"
              className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 m-2 rounded-xl shadow-lg text-center"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Username"
            />
            <input
              type="password"
              className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 m-2 rounded-xl shadow-lg text-center"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <button
            className="bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 lg:w-1/2 md:w-1/2 sm:w-1/2 rounded-xl shadow-lg my-5 w-full font-bold text-white"
            type="submit"
          >
            Login
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
