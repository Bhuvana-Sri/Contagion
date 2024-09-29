import React, { useEffect, useState } from "react";
import axios from "axios";
import { Map, HeatMap, GoogleApiWrapper } from "google-maps-react";

import "./MapContainer.css";

function MapContainer(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/contagion/patient/visitedlocations`)
      .then((res) => {
        setData(res.data.visited_locations);
      });
  }, []);

  const gradient = [
    "rgba(255, 255, 0 ,0)",
    "rgba(255, 255, 0 ,1)",
    "rgba(245, 149, 25, 1)",
    "rgba(235, 100, 50, 1)",
    "rgba(245, 50, 25, 1)",
    "rgba(245, 50, 0, 1)",
    "rgba(245, 0, 0, 1)",
    "rgba(255, 0, 0, 1)",
    "rgba(245, 0, 0, 1)",
    "rgba(255, 0, 0, 1)",
  ];

  return (
    <div>
      {data && (
        <Map
          style={{ height: "100%", width: "100%", position: "relative" }}
          className="map"
          google={props.google}
          zoom={10.8}
          initialCenter={{
            lat: 17.38714,
            lng: 78.491684,
          }}
        >
          <HeatMap
            gradient={gradient}
            opacity={0.8}
            positions={data}
            radius={20}
          />
        </Map>
      )}
    </div>
  );
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyDb0kg3JXMQLN0CIqpdnXmy2JJitnYhpFo",
  libraries: ["visualization"],
})(MapContainer);
