(function () {

  //set map location, zoom
  var map = L.map('map', {
    center: [38.016, -79.69],
    zoom: 7.5,
    minZoom: 7,
    maxZoom: 14,
    zoomControl: false,
    zoomSnap: 1
  })

  //add basemap
  var tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  //re-position zoomControl
  L.control.zoom({
    position: 'topright'
  }).addTo(map);

  // request all data here (deferred)
  var countiesData = $.getJSON('data/va-counties.geojson'),
      easementsData = $.getJSON('data/dcr-easements.json'),
      cpEasementsData = $.getJSON('data/cp-easements-list1.geojson');

  // use jQuery promise to wait until they're all loaded
  $.when(countiesData, easementsData, cpEasementsData).done(drawMap);

  // drawMap function called when datalayers are loaded and ready 
  function drawMap(countiesData, easementsData, cpEasementsData) {

    drawCounties(countiesData);
    drawEasements(easementsData);
    drawcpEasements(cpEasementsData);

  } //end of drawMap function


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

    //searchByCounty(counties, countiesList)

  } //end of drawCounties function 

     
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
  
  //add CP easements to map
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
        //console.log(feature.properties.cp_listacr)
        //build CP easement tooltip
        var toolTipInfo = "<b>County:</b> " + feature.properties.county + "<br><b>Acreage:</b> " + 
                          feature.properties.cp_listacr + "<br><b>Holder:</b> " + feature.properties.cp_listhol +
                          "<br><b>Conservation Values:</b> " + feature.properties.cp_listcon + 
                          "<br><b>Year Placed in Easement:</b> " + feature.properties.year;
        layer.bindTooltip(toolTipInfo, {
          sticky: true,
          toolTipAnchor: [200,200]
        });
      }
    }).addTo(map);

    //filterByYear(cpEasements)

  }

  // function filterByYear(cpEasements) {

  //   // select the UI slider
  //   $("#slider").on("input change", function(res) {
      
  //     // code will repeat with each slider change

  //     console.log(res.target.value)

  //     cpEasements.eachLayer(function(layer) {
  //       console.log(layer.feature.properties)
  //       // if(feature properties year is equal the current selected value)
  //       // then show easement
  //       // else hide easement
  //     })
  //   });
  // }
 
 
})(); //end of master function