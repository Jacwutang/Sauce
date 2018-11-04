# Instructions

## Prerequisites:
1) NodeJS 10.x 
2) Python 3.x

## Setup
1) git clone {this repository}
2) Go to root level of the cloned repo and ``` npm install ```, and start the node server with ```npm run start```
3) cd into frontend folder and npm install, and  start webpack server with ```npm run start-dev```


### Proceed to http://localhost:3000
![application](https://puu.sh/BWfZy/076eeebfdd.png)

### Features

#### 1) GUI for starting/stopping health check
- Implemented using websockets, Node server pushes data at a one second interval at a lower overhead cost than continous http polling
``` javascript
const pollingHelper = () => {
  request("http://127.0.0.1:12345", (error, response, body) => {
    //Emit statusCode, and timestamp to front-end
    socket.emit("dataPoint", {
      timestamp: Date.now(),
      status: response.statusCode
    });
  });
};
```
- Used a charting library to graph / table continous data

![demo-one](http://g.recordit.co/7NY5hvDFIa.gif)

#### 2) Rolling data for the past 5 minutes
![demo-two](http://g.recordit.co/2k0grwkw9D.gif)
- Since data is updated approximately once per second, I used this approximation to store at most 300 ( 5 (minutes) * 60 seconds == 300 seconds) data points.
``` javascript
insertIndex =  counter % 300
counter = (counter + 1) % 300
```
Once all 300 slots in the array are filled, the next entry will be at index 0. 


#### 3) Testing
- Still in progress. Ran into some issues with environment configuration, and deployment
- After cloning, ```cd frontend``` and ```npm run test```


