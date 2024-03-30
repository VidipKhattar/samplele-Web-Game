import logo from "../playbutton.svg";
import "../App.css";
import axios from "axios";
import React from "react";
import SearchBar from "../components/searchBar";

class MainPage extends React.Component {
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
      <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-orange-500 animate-gradient-x min-h-screen lg:flex lg:justify-center lg:items-center  md:flex md:justify-center md:items-center">
        <div className="container mx-auto px-4 text-center">
          <header className="text-6xl font-bold mb-2 text-white">
            samplele.
          </header>
          <h2 className="text-white text-xl font-bold mb-4">
            listen to the sample and try and guess which rap song samples it.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-10 sm:grid-cols-1 gap-4">
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-4">
              <SearchBar></SearchBar>
            </div>
            <div className="md:col-span-4 sm:col-span-4 grid grid-cols-2 gap-4">
              <button
                className="bg-blue-600 hover:bg-opacity-80 transition-colors duration-300 ease-in-out bg-opacity-50 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-10 w-full font-bold text-white"
                type="button"
              >
                Lock In
              </button>
              <button
                className="flex items-center justify-center bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-xl shadow-lg mb-10"
                type="button"
              >
                <img src={logo} alt="Logo" />
              </button>
            </div>
          </div>

          {this.state.details.map((output, id) => (
            <div
              key={id}
              className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4"
            >
              <div className="md:col-span-2 sm:col-span-1 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 flex flex-col md:flex-row justify-center items-center">
                <div className="flex justify-center items-center md:block sm:block">
                  <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg w-48 h-48 flex justify-center items-center">
                    <button
                      className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-2 rounded-full shadow-lg "
                      type="button"
                    >
                      <img src={logo} alt="Logo" className="w-12 h-12" />
                    </button>
                  </div>
                </div>

                <div className="col-span-1 text-center md:text-left">
                  <p className="font-bold text-2xl py-4">
                    {output.sampler_title}
                  </p>
                  <p className="text-xl pb-4">{output.sampler_title}</p>
                  <p className="text-xl pb-4">{output.sampler_artist}</p>
                  <p className="text-xl pb-4">{output.sampler_year}</p>
                </div>
              </div>

              <div className="lg:col-span-1 sm:col-span-2 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg">
                <p className="py-2">{output.clue_2}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MainPage;
