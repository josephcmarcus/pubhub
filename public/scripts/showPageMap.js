mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: pub.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(pub.geometry.coordinates)
.addTo(map);