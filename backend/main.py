from flask import Flask, json, request
from flask_cors import CORS
from dal.mongodal import MongoCrud
from mock_data.generatemap import distance
from mock_data.mock_patients import generateMockData
import os


mongoHost = "localhost"
port = 27017

if os.getenv("MONGO_HOST") is not None:
    mongoHost = os.getenv("MONGO_HOST")
if os.getenv("MONGO_PORT") is not None:
    port = os.getenv("MONGO_PORT")

name = "name"
aadhar = "aadhar_no"
age = "age"
gender = "gender"
phoneNo = "phone_no"
personContact = "persons_contact"
placesVisited = "places_visited"
date = "date"
bloodGroup = "blood_group"
donatePlasma = "donate_plasma"
status='status'
lat="lat"
lng="lng"


app = Flask(__name__)
CORS(app)

@app.route("/contagion/patient", methods=['GET','POST','PUT','DELETE'])
def patientRecord():
    db="contagion"
    collection="patient"
    try:
        client = MongoCrud(mongoHost, port, db, collection)

        if request.method == 'POST':
            data = request.json
            client.create(data)
            resp = app.response_class(
                response=json.dumps({"status": "SUCCESS"}),
                status=200,
                mimetype='application/json')
            return resp

        if request.method=='GET':
            aadharNo = request.args.get(aadhar)
            if aadharNo is None:
                query = {}
                result = client.list(query, projection={'_id': False})
                json_docs = []
                for doc in result:
                    json_docs.append(doc)
                return app.response_class(
                    response=json.dumps({"status": "SUCCESS", "patient_details": json_docs}),
                    status=200,
                    mimetype='application/json')
            else:
                query={aadhar: aadharNo}
                result=client.read(query, projection={'_id': False})
                return app.response_class(
                response=json.dumps({"status": "SUCCESS", "patient_details": result}),
                status=200,
                mimetype='application/json')

        if request.method=='PUT':
                aadharNo = request.args.get(aadhar)
                query = {aadhar: aadharNo}
                data = request.json
                result = client.update(query, {"$set":data})
                return app.response_class(
                    response=json.dumps({"status": "SUCCESS"}),
                    status=200,
                    mimetype='application/json')

    except Exception as e:
        print(e)
        return app.response_class(
            response=json.dumps({"status":"FAIL", "Error":"Internal Server Error: Error occured in mongo connection"}),
            status=400,
            mimetype='application/json'
    )


@app.route("/contagion/patient/list", methods=['GET'])
def patientList():
    db = "contagion"
    collection = "patient"
    try:
        client = MongoCrud(mongoHost, port, db, collection)
        query = {}
        result = client.list(query, projection={'_id':False, aadhar: True, name:True})
        json_docs = []
        for doc in result:
            obj={
                'text':doc[name],
                'value':doc[aadhar]
            }
            json_docs.append(obj)
        return app.response_class(
        response=json.dumps({"status": "SUCCESS", "node_list": json_docs}),
        status=200,
        mimetype='application/json')

    except Exception as e:
        print(e)
        return app.response_class(
        response=json.dumps({"status": "FAIL", "Error": "Internal Server Error: Error occured in mongo connection"}),
        status=400,
        mimetype='application/json')


@app.route("/contagion/patient/nodelist", methods=['GET'])
def nodeListRecord():
    db = "contagion"
    collection = "patient"
    try:
        client = MongoCrud(mongoHost, port, db, collection)
        query = {}
        result = client.list(query, projection={'_id':False, aadhar: True, name:True, status:True, personContact: True})

        nodes=[]
        links=[]
        for doc in result:
            nodes.append({
                'id':doc[aadhar],
                'name':doc[name],
                'status': doc[status]
            })
            for contact in doc[personContact]:
                links.append({
                    'source':doc[aadhar],
                    'target':contact
                })

        json_docs={
            'nodes': nodes,
            'links': links
        }
        return app.response_class(
            response=json.dumps({"status": "SUCCESS", "node_list": json_docs}),
            status=200,
            mimetype='application/json')
    except Exception as e:
        print(e)
        return app.response_class(
            response=json.dumps({"status":"FAIL", "Error":"Internal Server Error: Error occured in mongo connection"}),
            status=400,
            mimetype='application/json')

@app.route("/contagion/patient/visitedlocations", methods=['GET'])
def visitedLocations():
    db = "contagion"
    collection = "patient"
    try:
        client = MongoCrud(mongoHost, port, db, collection)
        query = {}
        result = client.list(query, projection={'_id': False, placesVisited: True})
        json_docs = []
        for doc in result:
            for eachDoc in doc[placesVisited]:
                json_docs.append(eachDoc)

        return app.response_class(
            response=json.dumps({"status": "SUCCESS", "visited_locations": json_docs}),
            status=200,
            mimetype='application/json')
    except Exception as e:
        print(e)
        return app.response_class(
            response=json.dumps(
                {"status": "FAIL", "Error": "Internal Server Error: Error occured in mongo connection"}),
            status=400,
            mimetype='application/json')

@app.route("/contagion/patient/plasma/donor/details", methods=['GET'])
def plasmaDonorDetails():
    db = "contagion"
    collection = "patient"
    try:
        client = MongoCrud(mongoHost, port, db, collection)
        query={"donate_plasma": True, "status":"Recovered"}
        result = client.list(query, projection={'_id': False, name: True, bloodGroup: True, age: True, phoneNo: True})
        json_docs = []
        for doc in result:
            json_docs.append(doc)
        return app.response_class(
            response=json.dumps({"status": "SUCCESS", "recovered_patients": json_docs}),
            status=200,
            mimetype='application/json')
    except Exception as e:
        print(e)
        return app.response_class(
            response=json.dumps(
                {"status": "FAIL", "Error": "Internal Server Error: Error occured in mongo connection"}),
            status=400,
            mimetype='application/json')

@app.route("/contagion/patient/transmission/predict", methods=['GET'])
def predictTransmission():
    db = "contagion"
    patientColl = "patient"
    hotspotColl = "covid_hotspots"
    radius=0.05
    try:
        result=[]
        patientClient = MongoCrud(mongoHost, port, db, patientColl)
        query = {}
        patients = patientClient.list(query, projection={'_id': False, aadhar: True})
        hotspotClient = MongoCrud(mongoHost, port, db, hotspotColl)

        for doc in patients:
            extractedAadhar=doc[aadhar]

            if patientClient.read({personContact: {'$in': [extractedAadhar]}}, {}) is None:
                possiblePlaces = []
                hotspots = hotspotClient.list(query, projection={'_id': False})
                unknownPatients=patientClient.read({aadhar: extractedAadhar}, projection={'_id': False, name: True, placesVisited: True})
                for eachVisitPlace in unknownPatients[placesVisited]:
                    for eachHotspot in hotspots:
                        if distance(eachVisitPlace[lat], eachVisitPlace[lng], eachHotspot[lat], eachHotspot[lng], radius):
                            possiblePlaces.append(eachHotspot)

                result.append({
                    name: unknownPatients[name],
                    'possible_transmitted_places': possiblePlaces
                })

        return app.response_class(
            response=json.dumps({"status": "SUCCESS", "prediction": result}),
            status=200,
            mimetype='application/json')

    except Exception as e:
        print(e)
        return app.response_class(
            response=json.dumps(
            {"status": "FAIL", "Error": "Internal Server Error: Error occured in mongo connection"}),
            status=400,
            mimetype='application/json')


@app.route("/contagion/patient/mock/generate", methods=['GET'])
def mockGeneration():
    try:
        generateMockData(30)

        return app.response_class(
            response=json.dumps({"status": "SUCCESS"}),
            status=200,
            mimetype='application/json')

    except Exception as e:
        print(e)
        return app.response_class(
            response=json.dumps(
            {"status": "FAIL", "Error": "Internal Server Error: Error occured in mongo connection"}),
            status=400,
            mimetype='application/json')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000", debug=True)

