import React from "react";
import "./index.css";
const Table = props => (
  <table>
    <tbody>
      <tr>
        <th> Success (200 response) </th>
        <th> Failure (500 Response) </th>
        <th> Other </th>
      </tr>
      <tr>
        <td> {props.data["Success"]} </td>
        <td> {props.data["Failure"]} </td>
        <td> {props.data["Other"]} </td>
      </tr>
    </tbody>
  </table>
);

export default Table;
