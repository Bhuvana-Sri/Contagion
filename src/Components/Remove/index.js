import React, { useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import axios from "axios";

import { connect } from "react-redux";
import { removeDetails } from "../../actions/removeDetails";
import "./Remove.css";

function Remove(props) {
  const [name, setName] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [stat, setStat] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setStat(null);
    let patient_details = {
      name,
      aadhar_no: aadhar,
      status: "Recovered",
      date: new Date(),
    };
    axios
      .put(`http://localhost:5000/contagion/patient?aadhar_no=${aadhar}`, {
        ...patient_details,
      })
      .then((res) => {
        res.status === 200 ? setStat("positive") : setStat("negative");
      });
    props.removeDetails({ patient_details });
  };

  return (
    <Form className="remove" onSubmit={handleSubmit}>
      {stat && stat === "positive" && (
        <Message positive>
          <Message.Header>
            You're details were updated successfully
          </Message.Header>
        </Message>
      )}
      {stat && stat === "negative" && (
        <Message negative>
          <Message.Header>
            There was an error updating your details
          </Message.Header>
        </Message>
      )}
      <img className="login" src={require("./login.svg")} alt="" />

      <Form.Field>
        <label className="label-text-heading">
          Please enter following if you've tested{" "}
          <span style={{ color: "FireBrick" }}>Negative</span> so we can update
          your details
        </label>
        <label className="label-text">Name</label>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Field>

      <Form.Field>
        <label className="label-text">Aadhar Number</label>
        <input
          placeholder="Aadhar Number"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
        />
      </Form.Field>

      <Button
        secondary
        type="submit"
        onSubmit={handleSubmit}
        className="submit-button"
      >
        Submit
      </Button>
    </Form>
  );
}

const mapDispatchToProps = (dispatch) => ({
  removeDetails: (details) => dispatch(removeDetails(details)),
});

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps, mapDispatchToProps)(Remove);
