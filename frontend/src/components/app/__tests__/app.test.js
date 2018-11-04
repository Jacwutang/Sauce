import React from "react";
import App from "../";
import { shallow } from "enzyme";

it("renders 1 <App/> component", () => {
  shallow(<App />);
});
