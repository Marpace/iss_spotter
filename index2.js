const {nextISSTimesForMyLocation} = require("./iss_promised");


nextISSTimesForMyLocation()
  .then(passTimes => passTimes.forEach(time => console.log(time)))
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });

