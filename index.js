const { fetchMyIP,  fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {

//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);

// });

// fetchCoordsByIP(ip, (error, coordinates) => {

//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned coordinates:' , coordinates);
  
// })

const sampleCoords = { latitude: 43.653226, longitude: -79.3831843 }

fetchISSFlyOverTimes(sampleCoords, (error, data) => {
  
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  console.log('It worked! Returned next flyover times:' , data);
})