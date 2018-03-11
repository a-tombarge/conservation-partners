(function (){

  L.mapbox.accessToken = 'pk.eyJ1IjoiYS10b21iYXJnZSIsImEiOiJjamRkdXM3ZG0wM3M2MnFtMjZsMnVibDB5In0.iJk8JWQpFOjMnWbgfYwRzw';
    
  var map = L.mapbox.map('map', 'mapbox.streets-basic', {
      center: [37.85, -80.21],
      zoom: 7.5,
      minZoom: 7,
      maxZoom: 14,
      zoomControl: false
     // maxBounds: L.latLngBounds([39, -85], [36, -70])
   
  });

  L.control.zoom({
    position:'topright'
  }).addTo(map);
 
  //Using omnivore to load my data layers

  omnivore.geojson('data/cp-easements-list1.geojson').addTo(map);
  
  
  omnivore.topojson('data/dcr-easements-topojson.json').addTo(map); 

  omnivore.geojson('data/va-counties.geojson').addTo(map);

})(); //end of master function