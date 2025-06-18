const needle = require("needle");

const fetchMyIP = (callback) => {
  needle.get("https://api.ipify.org?format=json", (err, response, body) => {

    if (err) return callback(err, null);

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const IP = body.ip;
      callback(null, IP);
    }
  });
};

const fetchCoordsByIP = (ip, callback) => {
  needle.get(`http://ipwho.is/${ip}`, (err, response, body) => {
    
    if (err) return callback(err, null);

    //body has a success key where the value is a boolean
    //checking for a false success
    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}`;
      callback(Error(message), null);
      return;
    }

    const coords = {latitude: body.latitude, longitude: body.longitude};

    callback(null, coords);

  });
};

const fetchISSFlyOverTimes = (coordinates, callback) => {
  needle.get(`https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`, (err, response, body) => {

    if (err) return callback(err, null);
    
    //checking for non-200 status code
    if (response.statusCode !== 200) {
      const message = `Status code: ${response.statusCode} when fetching ISS flyover times: ${body}`;
      callback(Error(message), null);
      return;
    }
    
    const result = [];
    //looping through the response array and pushing the final string result to the result array.
    body.response.forEach(item => {
      const passTime = new Date(0);
      passTime.setUTCSeconds(item.risetime);
      result.push(`Next pass at ${passTime} for ${item.duration} seconds`);
    });

    callback(null, result);

  });
};


const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {

    if (error) {
      console.log("It didn't work!" , error);
      return;
    }

    fetchCoordsByIP(ip, (error, coordinates) => {

      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
      
      fetchISSFlyOverTimes(coordinates, (error, data) => {
        
        if (error) {
          console.log("It didn't work!" , error);
          return;
        }
        
        callback(null, data);
      });
      
    });
        
  });
};



module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};

