import React from "react";

const Line = ({ ...restProps }) => {
  return <line {...restProps} stroke="black" strokeWidth={1.5} />;
};

export default Line;
