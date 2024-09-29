import React, { useEffect, useState } from "react";
import Graph from "react-graph-network";
import axios from "axios";

import Node from "./Node";
import Line from "./Line";
import "./Chart.css";

function Chart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/contagion/patient/nodelist`)
      .then((res) => {
        setData(res.data.node_list);
      });
  }, []);

  return (
    <div className="chart">
      {data && (
        <Graph
          data={data}
          hoverOpacity={0.2}
          NodeComponent={Node}
          LineComponent={Line}
          enableDrag
          nodeDistance={6}
          zoomDepth={1}
        />
      )}
    </div>
  );
}

export default Chart;
