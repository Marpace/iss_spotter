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

    if(err) return callback(err, null);
    
    if (response.statusCode !== 200 ) {
      const message = `Status code: ${response.statusCode} when fetching ISS flyover times: ${body}`;
      callback(Error(message), null);
      return;
    }
    
    const result = []; 
    
    body.response.forEach(item => {
      item.risetime = new Date(item.risetime).toISOString();
      item.duration = `${item.duration} seconds`;
      result.push(item);
    })

    callback(null, result)

  })
}



module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes};

