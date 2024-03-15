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
      <div>
        <header>Data Generated From Diango</header>
        <h1>hello</h1>
        {this.state.details.map((output, id) => (
          <div key={id}>{output.sampler_title}</div>
        ))}
      </div>
    );
  }
}
export default App;
