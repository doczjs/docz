import React from "react";
import { MemoryRouter } from "react-router-dom";

export default ({ children }) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};
