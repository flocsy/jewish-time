function fetchUtcOffset(latitude, longitude) {
    console.log("FETCHING UTC OFFSET");
    if (true) { // hack to set coordinates in emulator
      latitude = 31.828200;
      longitude = 34.683248;
      console.log("overridden latitude = " + latitude);
      console.log("overridden longitude = " + longitude);
    }
    
    var bigLat = Math.round(parseFloat(latitude)*1000);
    console.log("latitude = " + bigLat);
    var bigLon = Math.round(parseFloat(longitude)*1000);
    console.log("longitude = " + bigLon);
    
    var today = new Date();

    var delta_minutes = -today.getTimezoneOffset();
    console.log("Timezone Offset = " + delta_minutes);
    
    Pebble.sendAppMessage({
                          "lat":bigLat,
                          "lon":bigLon,
                          "tz":delta_minutes
                          }, function(e){
                            console.log('Message sent successfully: ' + JSON.stringify(e));
                          }, function(e){
                            console.log('Message failed: ' + JSON.stringify(e));
                          });
}

function locationSuccess(pos) {
    var coordinates = pos.coords;
    fetchUtcOffset(coordinates.latitude, coordinates.longitude);
}

function locationError(err) {
  console.warn('location error (' + err.code + '): ' + err.message);
}

var locationOptions = { "timeout": 15000, "maximumAge": 60000 }; 

Pebble.addEventListener("ready",
                        function(e) {
                          console.log("connect!" + e.ready);
                          locationWatcher = window.navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
                          console.log(e.type);
                        });

Pebble.addEventListener("appmessage",
                        function(e) {
                          window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
                          console.log(e.type);
                          console.log("Message Received!");
                        });

Pebble.addEventListener("webviewclosed",
                                     function(e) {
                                     console.log("webview closed");
                                     console.log(e.type);
                                     console.log(e.response);
                                     });


