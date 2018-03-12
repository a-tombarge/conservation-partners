(function () {

 //L.mapbox.accessToken = 'pk.eyJ1IjoiYS10b21iYXJnZSIsImEiOiJjamRkdXM3ZG0wM3M2MnFtMjZsMnVibDB5In0.iJk8JWQpFOjMnWbgfYwRzw';

  // var map = L.mapbox.map('map', 'mapbox.streets-basic', {
  //   center: [38.016, -79.69],
  //   zoom: 7.5,
  //   minZoom: 7,
  //   maxZoom: 14,
  //   zoomControl: false,
  //   zoomSnap: 1
  //   // maxBounds: L.latLngBounds([39, -85], [36, -70])

  // });

  var map = L.map('map', {
    center: [38.016, -79.69],
    zoom: 7.5,
    minZoom: 7,
    maxZoom: 14,
    zoomControl: false,
    zoomSnap: 1
  })

  var tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({
    position: 'topright'
  }).addTo(map);

  // request all data here (deferred)
  var countiesData = $.getJSON('data/va-counties.geojson'),
      easementsData = $.getJSON('data/dcr-easements.json'),
      cpEasementsData = $.getJSON('data/cp-easements-list1.geojson');


  // use jQuery promise to wait until they're all loaded
  $.when(countiesData, easementsData, cpEasementsData).done(ready);

  // function called when data are loaded and ready
  function ready(countiesData, easementsData, cpEasementsData) {

      // data are all now loaded and accessible within this function
      drawCounties(countiesData);
      drawEasements(easementsData);
      drawcpEasements(cpEasementsData);

  }

  function drawCounties(countiesData) {

    var countiesList = []

    var counties = L.geoJson(countiesData, {
      style: function (feature) {
        return {
          color: '#999999',
          weight: 1.5,
          fillOpacity: 0
        };
      },
      filter: function(feature) {
        countiesList.push(feature.properties.NAME)
        return feature
      }
    }).addTo(map);

    searchByCounty(counties, countiesList)


  }

  function searchByCounty(counties, countiesList) {

    // user searches for county name
    // they select "Nottoway"
    var searchName = "Nottoway"
    counties.eachLayer(function(layer) {
      // if selected name is equal to layer name
      if(layer.feature.properties.NAME === searchName) {
        // get bounding box of layer
        // zoom to that bounding box
        // maybe highlight the border
      }
    })

  }

  function drawEasements(easementsData) {

    L.geoJson(easementsData, {
      style: function (feature) {
        return {
          color: '#9feaf9',
          weight: 0.3,
          fillOpacity: 0.5,
          fillColor: '#9feaf9'
        };
      }
    }).addTo(map);


  }
  

  function drawcpEasements(cpEasementsData) {

    var cpEasements = L.geoJson(cpEasementsData, {
      style: function (feature) {
        return {
          color: '#fc2a2a',
          weight: 0.5,
          fillOpacity: 1,
          fillColor: '#fc2a2a'
        };
      },
      onEachFeature(feature, layer) {
        //console.log(feature.properties)
        layer.bindTooltip(feature.properties.first_name)
      }
    }).addTo(map);

    filterByYear(cpEasements)

  }

  function filterByYear(cpEasements) {

    // select the UI slider
    $("#slider").on("input change", function(res) {
      
      // code will repeat with each slider change

      console.log(res.target.value)

      cpEasements.eachLayer(function(layer) {
        console.log(layer.feature.properties)
        // if(feature properties year is equal the current selected value)
        // then show easement
        // else hide easement
      })


    });

  }
 
})(); //end of master function