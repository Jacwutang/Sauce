import React, { Component } from "react";
import "./index.css";
import Table from "../table";
import { LineChart, Line } from "recharts";
import socketIOClient from "socket.io-client";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      data: [],
      category: {
        Success: 0,
        Failure: 0,
        Other: 0
      },
      showLogs: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.toggleLogs = this.toggleLogs.bind(this);
    this.intervalId = null;
    this.endpoint = "/api/health-check";
    this.failureCodes = [500];
    this.socket = socketIOClient("http://localhost:5000");
  }

  componentDidMount() {
    this.socket.on("dataPoint", point =>
      this.setState({
        data: this.state.data.concat(point),
        category: this.helper(point.status)
      })
    );
  }

  reset() {}

  helper(status) {
    //determine which category to place response

    let ret;
    let newObj;
    if (status == 200) {
      ret = "Success";
    } else if (status == 500) {
      ret = "Failure";
    } else {
      ret = "Other";
    }
    newObj = { ...this.state.category };
    newObj[ret] += 1;
    return newObj;
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleClick(e) {
    console.log("clicked");
    e.preventDefault();

    this.togglePolling();

    this.setState({ active: !this.state.active });
  }

  togglePolling() {
    // Start/Stop polling depending on current status
    fetch(`http://localhost:5000${this.endpoint}/?active=${this.state.active}`);
  }

  toggleLogs() {
    return (
      <ul>
        {this.state.data.slice(-10).map((point, idx) => (
          <li key={idx}>
            <span> {point.timestamp}</span>
            <span> {point.status} </span>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { active, data, category } = this.state;
    console.log(this.state);
    return (
      <div className="container">
        <div className="side-container">
          <button onClick={this.handleClick}>
            {" "}
            {active == false ? "Start" : "Pause"} Health Check{" "}
          </button>
          <button
            onClick={() => this.setState({ showLogs: !this.state.showLogs })}
          >
            {" "}
            Show Rolling Logs{" "}
          </button>
        </div>
        {this.state.showLogs ? this.toggleLogs() : null}
        <Table data={category} />
      </div>
    );
  }
}

export default App;
