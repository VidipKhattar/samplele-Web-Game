import React, { useState } from "react";
import axios from "axios";
import AdminPage from "./adminLogin";

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status

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
        "http://127.0.0.1:8000/login2/", // URL for your login view
        credentials
      );
      setMessage("Login successful"); // Set message for successful login
      setLoggedIn(true); // Set logged-in status to true upon successful login
      onLogin();
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Incorrect username or password"); // Set message for incorrect login
    }
  };

  return (
    <div>
      {loggedIn ? (
        <AdminPage /> // Render AdminPage component if logged in
      ) : (
        <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-purple-500 animate-gradient-x min-h-screen lg:flex lg:justify-center lg:items-center md:flex md:justify-center md:items-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-6xl font-bold mb-2 text-white ">Admin Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="">
                <input
                  type="text"
                  className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 m-5 rounded-3xl shadow-lg text-center"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
                <input
                  type="password"
                  className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 m-5 rounded-3xl shadow-lg text-center"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </div>
              <button
                className="bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-10 w-full  font-bold text-white"
                type="submit"
              >
                Login
              </button>
            </form>
            {message && (
              <p className="text-4xl font-bold mb-2 text-white animate-pulse ">
                {message}
              </p>
            )}{" "}
            {/* Display message if it exists */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
