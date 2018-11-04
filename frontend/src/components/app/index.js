import React, { Component } from "react";
import "./index.css";
import Table from "../table";
import socketIOClient from "socket.io-client";
import { PieChart } from "react-easy-chart";
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
      counter: 0,
      showLogs: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.toggleLogs = this.toggleLogs.bind(this);
    this.endpoint = "/api/health-check";
    this.socket = socketIOClient("http://localhost:5000");
  }

  componentDidMount() {
    this.socket.on("dataPoint", point => {
      let copyData = this.state.data.slice();
      copyData[this.state.counter % 300] = point;
      this.setState({
        data: copyData,
        category: this.helper(point.status),
        counter: (this.state.counter + 1) % 300
      });
    });
  }

  componentWillUnmount() {
    this.socket.close();
    this.setState({ active: false });
    this.togglePolling();
  }

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

  handleClick(e) {
    // console.log("clicked");
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
        <span> timestamp </span>
        <span> status </span>
        {this.state.data.map((point, idx) => (
          <li key={idx}>
            <span> {point.timestamp}</span>
            <span> {point.status} </span>
          </li>
        ))}
      </ul>
    );
  }

  calculatePercentage(type) {
    return Math.round(
      (this.state.category[type] / this.state.data.length) * 100
    );
  }

  renderGraph() {
    return (
      <PieChart
        labels
        data={[
          {
            key: `Success ${this.calculatePercentage("Success")}%`,
            value: `${this.state.category["Success"]}`,
            color: "#E38627"
          },
          {
            key: `Failure ${this.calculatePercentage("Failure")}%`,
            value: `${this.state.category["Failure"]}`,
            color: "#C13C37"
          },
          {
            key: `Other ${this.calculatePercentage("Other")}%`,
            value: `${this.state.category["Other"]}`,
            color: "#6A2135"
          }
        ]}
      />
    );
  }

  render() {
    const { active, data, category } = this.state;
    // console.log(this.state);
    return (
      <div className="container">
        <h1> Health Monitoring Service </h1>
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

        {this.state.data.length > 0 ? this.renderGraph() : null}
      </div>
    );
  }
}

export default App;
