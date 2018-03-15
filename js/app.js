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


  //drawing my VA counties layer
  function drawCounties(countiesData) {

    //empty array to hold the county names
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

  //add VA conservation easements to map 
  function drawEasements(easementsData) {

    L.geoJson(easementsData, {
      style: function (feature) {
        return {
          color: '#ffc966',
          weight: 0.3,
          fillOpacity: 0.5,
          fillColor: '#ffc966'
        };
      },
      onEachFeature(feature, layer) {
        //console.log(feature.properties)
        var popupInfo = "<b>County:</b> " + feature.properties.county + "<br><b>Acreage:</b> " + 
                          feature.properties.TOTALACRE + "<br><b>Holder:</b> " + feature.properties.LABEL +
                          "<br><b>Year Placed in Easement:</b> " + feature.properties.ACQDATE + 
                          "<br><b>Is public access allowed? </b>" + feature.properties.PUBACCESS;
        
        layer.bindPopup(popupInfo);          
      
        //when clicking on layer
        layer.on('click', function() {
          //change the stroke color
          layer.setStyle({
            color: '#ffff4d',
            weight: 2
          }).bringToFront();
        });
        
        //when mousing off layer
        layer.on('mouseout', function() {
          // reset the layer style to its original stroke color
          layer.setStyle({
            color: '#ffc966',
            weight: 0.3,
            fillOpacity: 0.5,
            fillColor: '#ffc966'
          });
        });
      }  
    }).addTo(map);


  }//end of drawEasements function
  
  //add CP easements to map
  function drawcpEasements(cpEasementsData) {

    var cpEasementsLayer = L.geoJson(cpEasementsData, {
      style: function (feature) {
        return {
          color: '#fc2a2a',
          weight: 0.5,
          fillOpacity: 1,
          fillColor: '#fc2a2a'
        };
      },
      onEachFeature(feature, layer) {
        //console.log(feature.properties.year)
        
        //build CP easement tooltips
        var toolTipInfo = "<b>County:</b> " + feature.properties.county + "<br><b>Acreage:</b> " + 
                          feature.properties.cp_listacr + "<br><b>Holder:</b> " + feature.properties.cp_listhol +
                          "<br><b>Conservation Values:</b> " + feature.properties.cp_listcon + 
                          "<br><b>Year Placed in an Easement:</b> " + feature.properties.year;
        
        layer.bindTooltip(toolTipInfo, {
          sticky: true,
          toolTipAnchor: [200,200]
        });

        //when mousing over layer
        layer.on('mouseover', function() {
          //change the stroke color
          layer.setStyle({
            color: '#ffff4d',
            weight: 2
          }).bringToFront();
        });
        
        //when mousing off layer
        layer.on('mouseout', function() {
          // reset the layer style to its original stroke color
          layer.setStyle({
            color: '#fc2a2a'
          });
        });
      }
      
    }).addTo(map); 
  
    filterByYear(cpEasementsLayer);
  
  } //end of drawcpEasements function

  //slider filtering by year and totaling acreage per year
  function filterByYear(cpEasementsLayer) {
    



   //console.log(features.properties.year);
    // cpEasementsData.features.properties.forEach( {
    //   for (var year of cpEasementsData.features.properties) {
    //       console.log(year);
          //yearsList.push(features.properties[year]);
      
    //   }
    // });

    // create an empty layer group
    var hiddenLayers = L.layerGroup();

    // select the UI slider and on change
    $("#slider").on("input change", function(res) {
      
      // loop through the layers
      cpEasementsLayer.eachLayer(function(layer) {
        
        if (layer.feature.properties.year != res.target.value) {

          layer.setStyle({
            opacity: 0,
            fillOpacity: 0
          })

        } else {

          layer.setStyle({
            opacity: 1,
            fillOpacity: 1
          })

        }
                
      })
    });
  } //end filterByYear function



})(); //end of master function