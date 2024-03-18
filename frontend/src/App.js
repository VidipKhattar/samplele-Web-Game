import logo from "./logo.svg";
import "./App.css";

import axios from "axios";
import React from "react";

class App extends React.Component {
  state = { details: [] };
  componentDidMount() {
    let data;
    axios
      .get("http://127.0.0.1:8000/songposts")
      .then((res) => {
        data = res.data;
        this.setState({ details: data });
        console.log(data);
      })
      .catch((err) => {});
  }
  render() {
    return (
      <div className="bg-gradient-to-bl from-blue-400 to-orange-500 via-purple-500 animate-gradient-x min-h-screen flex justify-center items-center">
        <div className="container mx-auto px-4 text-center">
          <header className="text-2xl font-bold mb-4 text-white">
            Guess the Sample!
          </header>
          <h1 className="text-xl font-semibold mb-2 text-white">Rap</h1>
          <div className="grid grid-cols-1 gap-4">
            {this.state.details.map((output, id) => (
              <div
                key={id}
                className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-md shadow-lg"
              >
                <h2 className="text-lg font-semibold">
                  {output.sampler_title}
                </h2>
                <p className="text-gray-600">{output.sampler_artist}</p>
                <p className="text-gray-600">{output.sampler_year}</p>

                {/* Add more details here */}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
