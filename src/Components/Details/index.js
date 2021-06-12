import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Form,
  Dropdown,
  Radio,
  Message,
} from "semantic-ui-react";
import Autocomplete from "react-google-autocomplete";
import axios from "axios";

import { connect } from "react-redux";
import { storeDetails } from "../../actions/storeDetails";
import "./Details.css";

function Details(props) {
  const [name, setName] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [person, setPerson] = useState(null);
  const [loc, setLoc] = useState([]);
  const [phone, setPhone] = useState(null);
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [bloodGroup, setBloodGroup] = useState(null);
  const [plasma, setPlasma] = useState(false);
  const [result, setResult] = useState([]);
  const [data, setData] = useState(null);
  const [stat, setStat] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/contagion/patient/list`).then((res) => {
      setData(res.data.node_list);
    });
  }, []);

  function TodoItems() {
    const createTasks = (item) => {
      return <li key={item.key}>{item.text}</li>;
    };

    var todoEntries = result;
    var listItems = todoEntries.map(createTasks);

    return <ol className="list_class">{listItems}</ol>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setStat(null);
    let patient_details = {
      name,
      aadhar_no: aadhar,
      persons_contact: person,
      places_visited: loc,
      phone_no: phone,
      age,
      gender,
      blood_group: bloodGroup,
      donate_plasma: plasma,
      date: new Date(),
      status: "Active",
    };
    axios
      .post(`http://localhost:5000/contagion/patient`, {
        ...patient_details,
      })
      .then((res) => {
        res.status === 200 ? setStat("positive") : setStat("negative");
      });

    props.storeDetails({ patient_details });
  };

  const getPerson = (event, { value }) => {
    setPerson(value);
  };

  return (
    <Form className="container" onSubmit={handleSubmit}>
      {stat && stat === "positive" && (
        <Message positive>
          <Message.Header>
            You're details were submitted successfully
          </Message.Header>
        </Message>
      )}
      {stat && stat === "negative" && (
        <Message negative>
          <Message.Header>
            There was an error submitting your details
          </Message.Header>
        </Message>
      )}

      <img className="login" src={require("./login.svg")} alt="" />

      <Form.Field>
        <label className="label-text-heading">
          Please enter following details if you've tested{" "}
          <span style={{ color: "FireBrick" }}>Positive</span>
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

      <Form.Field>
        <label className="label-text">
          Persons you have been in contact with the last 14 days
        </label>
        <Dropdown
          placeholder="Contacts"
          fluid
          multiple
          search
          selection
          closeOnChange
          options={data}
          onChange={getPerson}
        />
      </Form.Field>

      <Form.Field>
        <label className="label-text">
          List of places you have visited in the last 14 days
        </label>
        <Autocomplete
          onPlaceSelected={(place) => {
            const { location } = place.geometry;
            const { lat, lng } = location;
            const coords = {
              lat: lat(),
              lng: lng(),
            };
            setLoc(loc.concat(coords));

            var newItem = {
              text: place.formatted_address,
              key: Date.now(),
            };
            document.getElementById("auto").value = " ";
            setResult(result.concat(newItem));
          }}
          id="auto"
          placeholder="Ex) Trinity heights- Gachibowli, Hyderabad"
          types={["establishment"]}
          componentRestrictions={{ country: "in" }}
        />
        <TodoItems entries={result} />
      </Form.Field>

      <Form.Field>
        <label className="label-text">Phone Number</label>
        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Form.Field>

      <Form.Field>
        <label className="label-text">Address</label>
        <Autocomplete
          onPlaceSelected={(place) => {
            const { location } = place.geometry;
            const { lat, lng } = location;
            const coords = {
              lat: lat(),
              lng: lng(),
            };
            setLoc(loc.concat(coords));
          }}
          placeholder="Ex) Aparna apt- Madapur, Hyderabad"
          types={["establishment"]}
          componentRestrictions={{ country: "in" }}
        />
      </Form.Field>

      <Form.Group>
        <Form.Field width={4}>
          <label className="label-text">Age</label>
          <input
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Form.Field>
        <Form.Field className="gender">
          <label className="label-text">Gender</label>
          <Radio
            className="radio-option"
            label="Male"
            name="radioGroup"
            value="Male"
            checked={gender === "Male"}
            onChange={(e, { value }) => setGender(value)}
          />
          <Radio
            className="radio-option"
            label="Female"
            name="radioGroup"
            value="Female"
            checked={gender === "Female"}
            onChange={(e, { value }) => setGender(value)}
          />
          <Radio
            className="radio-option"
            label="Other"
            name="radioGroup"
            value="Other"
            checked={gender === "Other"}
            onChange={(e, { value }) => setGender(value)}
          />
        </Form.Field>
      </Form.Group>
      <Form.Group>
        <Form.Field width={5}>
          <label className="label-text">Blood Group</label>
          <input
            placeholder="Blood Group"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          />
        </Form.Field>
        <Form.Group className="plasma">
          <Form.Field>
            <label className="label-text">Willing to donate Plasma</label>
          </Form.Field>
          <Form.Field className="plasma-toggle">
            <Radio toggle onChange={(e) => setPlasma(!plasma)} />
          </Form.Field>
        </Form.Group>
      </Form.Group>

      <Form.Field className="check">
        <Checkbox label="I agree to the use of my information" />
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
  storeDetails: (details) => dispatch(storeDetails(details)),
});

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
