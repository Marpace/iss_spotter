const needle = require("needle");

const fetchMyIP = (callback) => {
  needle.get("https://api.ipify.org?format=json", (err, response, body) => {

    if (err) callback(err, null);

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

module.exports = {fetchMyIP};

