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

    searchByCounty(counties, countiesList)


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

    // create an empty layer group
    var hiddenLayers = L.layerGroup();

    // select the UI slider and on change
    $("#slider").on("input change", function(res) {
      
      var currentYear = res.target.value;
      updateLayers(currentYear)

    });

    //creating variable for the filter and setting it to false initially
    var filtering = false;

    //selecting the reset-slider button 
    $("#reset-slider").click(function() {
      if(filtering === false) { //if the fliter is set to false on click
        $("#slider-input").removeAttr("disabled") //enable the slider
        $("#reset-slider").html("View all years") //change button label to view all years
        updateLayers("2005") //update the layers to show starting year
        filtering = true //filter is now set to true
      } else { 
        $("#slider-input").attr("disabled", true)
        $("#reset-slider").html("Filter by year")
        filtering = false
        $("#Year span").html("2005 - 2017")
        resetLayers()
      }
    })

    function updateLayers(currentYear) {
      // update year
      $("#Year span").html(currentYear)

      var totalAcreage = 0;

      // loop through the layers
      cpEasementsLayer.eachLayer(function(layer) {
        //if the current selection doesn't match currentYear, make other easements opaque
        if (layer.feature.properties.year != currentYear) {

          layer.setStyle({
            opacity: 0.2,
            fillOpacity: 0.2
          })

        } else { //otherwise total up the acreage and make the selected easements solid red
          
          totalAcreage += Number(layer.feature.properties.cp_listacr)
          
          layer.setStyle({
            opacity: 1,
            fillOpacity: 1
          })
        }         
      })

      // update Acreage in DOM
      $("#Acreage span").html(totalAcreage.toLocaleString())

    } //end of updateLayers function

    //resetting the easement layer to show all easements once "view all years" button clicked
    function resetLayers() {
      
      cpEasementsLayer.eachLayer(function(layer) {
        layer.setStyle({
          opacity: 1,
          fillOpacity: 1
        })
      })
      $("#Acreage span").html("42,108")
    } //end resetLayers function
  
   
  } //end filterByYear function

  //county search function
  function searchByCounty(counties, countyList) {

    new autoComplete({
      selector: 'input[name="search"]',
      minChars: 2,
      source: function(term, suggest){
          term = term.toLowerCase();
          var choices = countyList;
          var matches = [];
          for (i=0; i<choices.length; i++)
              if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
          suggest(matches);
      },
      onSelect: function(event, term, item) {

        zoomToCounty(term);
      }
    });


    function zoomToCounty(term) {

      counties.eachLayer(function(layer) {
        if(layer.feature.properties.NAME === term) {
   
          map.flyToBounds(layer.getBounds(), {
            paddingTopLeft: [350, 20]                    
          })
          
          layer.setStyle({
            color: "#006400",
            weight: 4.5
          })
        }

      });
    } //end zoomToCounty


  } //end searchByCounty function


})(); //end of master function