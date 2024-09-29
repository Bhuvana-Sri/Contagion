from math import sin, cos, sqrt, atan2, radians
import random

lat="lat"
lng="lng"

def distance(latitude1, longitude1, latitude2, longitude2, radius):
    R = 6373

    lat1 = radians(latitude1)
    lon1 = radians(longitude1)
    lat2 = radians(latitude2)
    lon2 = radians(longitude2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance<radius

def randomLat():
    return random.randint(0, 35000)/100000

def randomLong():
    return random.randint(0, 85000)/100000

def randomSign():
    return random.choice([-1, 1])

def generateMockMap(midLat, midLong, radius, size):
    resultArr=[]

    i=0
    while(i<size):
        newLat=midLat+(randomSign()*randomLat())
        newLong=midLong+(randomSign()*randomLong())
        if(distance(midLat, midLong, newLat, newLong, radius)):
            jsonObj={
                lat:round(newLat, 6),
                lng:round(newLong, 6),
            }
            resultArr.append(jsonObj)
            i=i+1

    return resultArr


