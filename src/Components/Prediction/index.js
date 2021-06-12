import React, { useEffect, useState } from "react";
import { Table, Header, Loader } from "semantic-ui-react";
import axios from "axios";

import "./Prediction.css";

export default function Prediction() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/contagion/patient/transmission/predict`)
      .then((res) => {
        let list = [];

        var i,
          l = res.data.prediction.length;

        for (i = 0; i < l; i++) {
          var j,
            len = res.data.prediction[i].possible_transmitted_places.length;

          for (j = 0; j < len; j++) {
            let loc_list =
              "lat:" +
              JSON.stringify(
                res.data.prediction[i].possible_transmitted_places[j].lat
              ) +
              "\nlng:" +
              JSON.stringify(
                res.data.prediction[i].possible_transmitted_places[j].lng
              );
            if (j === 0) {
              list.push({
                name: res.data.prediction[i].name,
                possible_transmitted_places: loc_list,
              });
            } else {
              list.push({
                Name: "",
                possible_transmitted_places: loc_list,
              });
            }
          }
        }
        setData(list);
      });
  }, []);

  return (
    <div className="prediction">
      <Header className="prediction-header" as="h2">
        Prediction
      </Header>
      <Loader active={data ? false : true} inline="centered" />
      {data && (
        <Table celled fixed className="prediction-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Possible transmitted places</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.name}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.possible_transmitted_places}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
