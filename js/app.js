(function (){

  L.mapbox.accessToken = 'pk.eyJ1IjoiYS10b21iYXJnZSIsImEiOiJjamRkdXM3ZG0wM3M2MnFtMjZsMnVibDB5In0.iJk8JWQpFOjMnWbgfYwRzw';
    
  var map = L.mapbox.map('map', 'mapbox.streets-basic', {
      center: [38.016, -79.69],
      zoom: 7.5,
      minZoom: 7,
      maxZoom: 14,
      zoomControl: false,
      zoomSnap: 1
     // maxBounds: L.latLngBounds([39, -85], [36, -70])
   
  });

  L.control.zoom({
    position:'topright'
  }).addTo(map);
 

  
  $.getJSON('data/cp-easements-list1.geojson', function(cpEasements){
    //console.log(cpEasements);
    L.geoJson(cpEasements).addTo(map);

  })

  $.getJSON('data/va-counties.geojson', function(counties){
    //console.log(counties);

    L.geoJson(counties, {
      style: function(feature) {
        return {
        color: '#A9A9A9',
        weight: 1.5,
        fillOpacity: 0 
        };
      }
    }).addTo(map);

  })

  //omnivore.topojson('data/dcr-easements-topojson.json').addTo(map); 

 
})(); //end of master function