var districts = {};
var apikey = "pk.eyJ1IjoiYWJvb2R6YmFqbyIsImEiOiJja3U1d21hNDEyYXJ4Mm5wYzJub3V5MGdlIn0.QVGymFsf-n1A-8i1LK1y0g";
var mymap = L.map('map');
var mylocation = null;

load_districts();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apikey,
}).addTo(mymap);

mymap.locate({
    setView: true,
    maxZoom: 14,
});



/***************************************************************
 * 
 *  Event listeners
 * 
**************************************************************/

document.getElementById("locateMe").addEventListener('click', () => {
    locateMe(mymap);
})

document.addEventListener("click", (event) => {
    if (event.target.classList[0] in districts) {
        updateLegend(districts[event.target.classList[0]]);
    }
})
/*************************************************************** 
**************************************************************/


function locateMe(mymap) {
    if (mylocation != null)
        mymap.removeLayer(mylocation);
    navigator.geolocation.getCurrentPosition(function (location) {
        var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
        mymap.setView(latlng, 15);

        mylocation = new L.Marker(latlng, {
            style: { className: "hi" },
            icon: L.icon({
                iconUrl: '../img/home.svg',
                iconSize: [30, 30],
                shadowSize: [50, 64],
            })
        }).addTo(mymap);
    });
};


function colorRange(value) {
    var r, g, b = 0;
    if (value < 50) {
        r = 255;
        g = Math.round(5.1 * value);
    }
    else {
        g = 255;
        r = Math.round(510 - 5.10 * value);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}

function load_districts() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status === 200 && xhr.DONE) {
            L.geoJson(JSON.parse(xhr.responseText), { style: areaStyle, onEachFeature: makeLabel }).addTo(mymap);
        }
    };
    xhr.open("GET", "api/", true);
    xhr.send();
}

function getAreaColor(feature) {
    var water = parseInt(feature.properties.water);
    var electricity = parseInt(feature.properties.electricity);
    var parking = parseInt(feature.properties.parking);

    return colorRange(((water + electricity + parking) / 300) * 100);
};

function areaStyle(feature) {
    return {
        fillColor: getAreaColor(feature),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5,
        className: feature.properties.name,
    }
};

function makeLabel(feature, layer) {
    var htmlLabel = `
    <b>${feature.properties.name}</b><br>
    <b>${feature.properties['name-ar']}</b><br>
    <img src="../img/${feature.properties.img}" width="100px">
    `;
    L.marker(layer.getBounds().getCenter()).bindPopup(htmlLabel).addTo(mymap);

    addToDistricts(feature);
}

function addToDistricts(feature) {
    var water = parseInt(feature.properties.water);
    var electricity = parseInt(feature.properties.electricity);
    var parking = parseInt(feature.properties.parking);
    districts[feature.properties.name] = { "parking": parking, "electricity": electricity, "water": water };
}

function updateLegend(district) {
    //parking
    //electricity
    //water
    $('.indicator').each((index, obj) => {
        var indicator = Object.keys(district)[index];
        obj.style.width = `${(district[indicator])}%`;
        obj.style.backgroundColor = colorRange(district[indicator]);
    })
}






