from pymongo import MongoClient

class MongoCrud:

    def __init__(self, mongoHost, port, db, collection):
        self.client=MongoClient(mongoHost, port)
        self.db=self.client[db]
        self.collection=self.db[collection]

    def create(self, query):
        return self.collection.insert(query)

    def read(self, query, projection):
        return self.collection.find_one(query, projection)

    def update(self, query, data):
        return self.collection.update(query, data)

    def delete(self, query):
        return self.collection.delete_one(query)

    def list(self, query, projection):
        return self.collection.find(query, projection)





