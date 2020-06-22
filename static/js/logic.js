var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var API_KEY = "sk.eyJ1IjoicmljaGFnNyIsImEiOiJja2JuMmFuN2kwbnJsMnluOHg5ODB0cXF6In0.waGgaMuAr359fB4MVHbi9w"
var MAP_URL = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
var plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(url, function(data){
    d3.json(plates_url, function(data2) {
        // Adding a satellite layer which will be the default
        var satellite = L.tileLayer(MAP_URL, {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/satellite-v9",
            accessToken: API_KEY
        });

        // Adding a grayscale layer
        var grayscale = L.tileLayer(MAP_URL, {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/light-v10",
            accessToken: API_KEY
        });

        // Adding an outdoors layer
        var outdoors = L.tileLayer(MAP_URL, {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox/outdoors-v11",
            accessToken: API_KEY
        });

        // Grabbing our GeoJSON data.
        var earthquakes = L.geoJson(data.features, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            style: circles
        });

        var plates = L.geoJson(data2.features, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            style: lines
        });

        // Define a baseMaps object to hold our base layers
        var baseMaps = {
            "Satellite": satellite,
            "Grayscale": grayscale,
            "Outdoors": outdoors
        };
    
        // Create overlay object to hold our overlay layer
        var overlayMaps = {
            Earthquakes: earthquakes,
            Plates: plates
        };

        // Create our map, giving it the layers and earthquakes layers to display on load
        var myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 4,
            layers: [satellite, grayscale, outdoors, earthquakes]
        });

        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

        //change circle color based off of magnitude color 
        function fillcolor(magnitude) {
            switch(true) {
                case magnitude > 5:
                // return 'white'
                return '#f00';
                case magnitude > 4: 
                // return red
                return '#ff4d00';
                case magnitude > 3:
                // return orange
                return '#ff8d00';
                case magnitude > 2: 
                // return yellow
                return '#ffdb00';
                case magnitude > 1: 
                // return neon yellow
                return '#fdff00'
                case magnitude > 0: 
                // return green
                return '#15ff00'
            };
        };

        function circles(feature) {
            return {
                radius: feature.properties.mag*3,
                fillColor: fillcolor(feature.properties.mag),
                color: fillcolor(feature.properties.mag),
                opacity: 1, 
                fillOpacity: 1
            };
        };

        function lines(feature) {
            return {
                color: "#ff8d00",
                weight: 2,
                opacity: 1,
                coordinates: feature.geometry.coordinates
            };
        };
    });
});
