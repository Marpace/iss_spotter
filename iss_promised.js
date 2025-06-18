const needle = require("needle");

const fetchMyIP = () => {
  return needle("get", "https://api.ipify.org?format=json")
  .then((response) => {
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response.body}`;
      throw new Error(msg);
    }
    return response.body.ip;
  })
  .catch(err => {
    console.log(err);
  })
}

const fetchCoordsByIP = (ip) => {
  return needle("get", `http://ipwho.is/${ip}`)
  .then(response => {

    const body = response.body;
    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP ${body.ip}`;
      throw new Error(message), null;
    }

    const coords = {latitude: response.body.latitude, longitude: response.body.longitude};
    return coords;

  })
  .catch(err => {
    console.log(err);
  })
}

const fetchISSFlyOverTimes = (coordinates) => {
  return needle("get", `https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`)
    .then(response => {

      if (response.statusCode !== 200) {
        const message = `Status code: ${response.statusCode} when fetching ISS flyover times: ${response.body}`;
        throw new Error(message), null;
      }

      const result = [];
      //looping through the response array and pushing the final string result to the result array.
      response.body.response.forEach(item => {
        const passTime = new Date(0);
        passTime.setUTCSeconds(item.risetime);
        result.push(`Next pass at ${passTime} for ${item.duration} seconds`);
      });

      return result

    })
    .catch(err => console.log)
}


const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
  .then((ip) => fetchCoordsByIP(ip))
  .then(coords => fetchISSFlyOverTimes(coords))
  .then(passTimes => passTimes)
}


module.exports = {nextISSTimesForMyLocation};