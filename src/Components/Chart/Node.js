import React from "react";

const Node = ({ node }) => {
  let fillColour;
  if (node.status === "Active") {
    fillColour = "FireBrick";
  } else if (node.status === "Recovered") {
    fillColour = "green";
  }
  return (
    <React.Fragment>
      <circle r="12" fill={fillColour} />
      <g style={{ fontSize: "12px" }}>
        <text y={25}>{node.name}</text>
      </g>
    </React.Fragment>
  );
};

export default Node;
