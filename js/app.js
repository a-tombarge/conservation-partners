(function (){

    L.mapbox.accessToken = 'pk.eyJ1Ijoicmdkb25vaHVlIiwiYSI6Im5Ua3F4UzgifQ.PClcVzU5OUj17kuxqsY_Dg';
  
    var map = L.mapbox.map('map', 'mapbox.light', {
      zoomSnap: .1,
      center: [-.23, 37.8],
      zoom: 7,
      minZoom: 6,
      maxZoom: 9,
      maxBounds: L.latLngBounds([-6.22, 27.72], [5.76, 47.83])
    });







}) //end of master function