import React, { Component } from "react";
import "./index.css";
import ReactTable from "react-table";
import { LineChart, Line } from "recharts";
import socketIOClient from "socket.io-client";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      data: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.intervalId = null;
    this.endpoint = "/api/health-check";
    this.failureCodes = [500];
  }

  componentDidMount() {
    const socket = socketIOClient("http://localhost:5000");
    socket.on("ping", ping =>
      this.setState({ data: this.state.data.concat(ping) })
    );
  }

  handleClick(e) {
    e.preventDefault();

    this.togglePolling();

    this.setState({ active: !this.state.active });
  }

  togglePolling() {
    // Start/Stop polling depending on current status
    fetch(`http://localhost:5000${this.endpoint}/?active=${this.state.active}`);
  }

  render() {
    console.log(this.state.data);
    const { active } = this.state;
    return (
      <div className="container">
        <div className="side-container">
          <button onClick={this.handleClick}>
            {" "}
            {active == false ? "Start" : "Pause"} Health Check{" "}
          </button>
          <button> Show Logs </button>
        </div>
      </div>
    );
  }
}

export default App;
