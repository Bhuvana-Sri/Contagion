import React, { useEffect, useState } from "react";
import { Table, Header, Loader } from "semantic-ui-react";
import axios from "axios";

import "./PlasmaDonor.css";

export default function PlasmaDonar() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/contagion/patient/plasma/donor/details`)
      .then((res) => {
        let list = [];

        var i,
          l = res.data.recovered_patients.length;
        for (i = 0; i < l; i++) {
          list.push({
            blood_group: res.data.recovered_patients[i].blood_group,
            name: res.data.recovered_patients[i].name,
            age: res.data.recovered_patients[i].age,
            phone_no: res.data.recovered_patients[i].phone_no,
          });
        }
        setData(list);
      });
  }, []);

  return (
    <div className="plasmaDonor">
      <Header className="plasma-header" as="h2">
        Plasma Donar Details
      </Header>
      <Loader active={data ? false : true} inline="centered" />
      {data && (
        <Table celled fixed className="plasma-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Age</Table.HeaderCell>
              <Table.HeaderCell>Blood group</Table.HeaderCell>
              <Table.HeaderCell>Phone number</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={item.name}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.age}</Table.Cell>
                <Table.Cell>{item.blood_group}</Table.Cell>
                <Table.Cell>{item.phone_no}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
