import React, { useState } from "react";
import { Menu, Sidebar, Icon } from "semantic-ui-react";

import Details from "../Details";
import Chart from "../Chart";
import MapContainer from "../MapContainer";
import Remove from "../Remove";
import Prediction from "../Prediction";
import PlasmaDonor from "../PlasmaDonor";
import "./App.css";

function App() {
  const [comp, setComp] = useState("Details");
  const getComp = (event, { value }) => {
    setComp(value);
  };

  return (
    <div className="App">
      <Sidebar
        as={Menu}
        animation="push"
        icon="labeled"
        inverted
        vertical
        visible
        width="thin"
      >
        <Menu.Item
          className="side-menu"
          as="a"
          value="Details"
          onClick={getComp}
        >
          <Icon name="user plus" />
          Details
        </Menu.Item>
        <Menu.Item
          className="side-menu"
          as="a"
          value="Network"
          onClick={getComp}
        >
          <Icon name="connectdevelop" />
          Network
        </Menu.Item>
        <Menu.Item className="side-menu" as="a" value="Map" onClick={getComp}>
          <Icon name="map marker alternate" />
          Map
        </Menu.Item>
        <Menu.Item
          className="side-menu"
          as="a"
          value="Prediction"
          onClick={getComp}
        >
          <Icon name="eye" />
          Prediction
        </Menu.Item>
        <Menu.Item
          className="side-menu"
          as="a"
          value="PlasmaDonor"
          onClick={getComp}
        >
          <Icon name="search plus" />
          Plasma Donors
        </Menu.Item>
        <Menu.Item
          className="side-menu"
          as="a"
          value="Remove"
          onClick={getComp}
        >
          <Icon name="user times" />
          Update Status
        </Menu.Item>
      </Sidebar>

      {comp === "Details" && <Details />}
      {comp === "Network" && <Chart />}
      {comp === "Map" && <MapContainer />}
      {comp === "Remove" && <Remove />}
      {comp === "Prediction" && <Prediction />}
      {comp === "PlasmaDonor" && <PlasmaDonor />}
    </div>
  );
}
export default App;
