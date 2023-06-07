// Create map
var myMap = L.map("map").setView([36.1716, -115.1391], 5);

// Add tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Function to select circle color based on depth
function getColor(depth) {
  if (depth >= -10 && depth < 10) {
    // Blue
    return "#0000FF";
  } else if (depth >= 10 && depth < 30) {
    // Green
    return "#00FF00";
  } else if (depth >= 30 && depth < 50) {
    // Yellow
    return "#FFFF00";
  } else if (depth >= 50 && depth < 70) {
    // Orange
    return "#FFA500";
  } else if (depth >= 70 && depth < 90) {
    // Red
    return "#FF0000";
  } else {
    // Maroon Brown
    return "#800000";
  }
}

// Fetching the JSON data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data.features.forEach(function (feature) {
      var Latitude = feature.geometry.coordinates[1];
      var Longitude = feature.geometry.coordinates[0];
      var mag = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];
      var place = feature.properties.place;
      var time = feature.properties.time;
      var timeFormatted = new Date(time).toLocaleString();

      var circleSettings = {
        radius: mag * 15,
        fillOpacity: .5,
        color: "white",
        fillColor: getColor(depth),
        weight: 1,
      };

      var circleInfo = `
  Place: ${place}
  <br>Latitude: ${Latitude}
  <br>Longitude: ${Longitude}
  <br>Magnitude: ${mag}
  <br>Depth: ${depth} km
  <br>Time: ${timeFormatted}
`;

      L.circleMarker([Latitude, Longitude], circleSettings)
        .bindPopup(circleInfo)
        .addTo(myMap);
    });
  })
  .catch(function (error) {
    console.log("An error occurred:", error);
  });

// Creating the legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend");
  var labels = ["-10 - 10 km", "10 to 30 km", "30 to 50 km", "50 to 70 km", "70 to 90 km", "90+ km"];
  var colors = ["#0000FF", "#00FF00", "#FFFF00", "#FFA500", "#FF0000", "#800000"];

  div.innerHTML += "<h4>Depth Legend</h4>";

  for (var i = 0; i < labels.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '; width: 10px; height: 10px; display: inline-block;"></i> ' +
      labels[i] +
      "<br>";
  }
  return div;
};

legend.addTo(myMap);


