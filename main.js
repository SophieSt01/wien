/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    title: "Stephansdom",
  };
  
  // alles was mit L. anfangt ist eine Leafletsache
  // Karte initialisieren
  let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);
  // die koordinaten sind in der Variable Stephansdom gespeichert, sie sind keine eigenen variablen --> let stephandsdom, deshlab muss ich auch darauf zugreifen
  
  // BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
  // das ist ein Plugin und wir können die Kartengrundlagen aus diesem Plugin verwenden.
  // ich könnt zum Beispiel auch "BasemapAT.terrain", "BasemapAT.orthofoto" machen dass hab ich an hillshade, orthofoto ... einfach probieren aber haben wir dann in den layers unten
  let startLayer = L.tileLayer.provider("BasemapAT.grau");
  startLayer.addTo(map);
  
  let themaLayer = {
    sights: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    stops: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
    hotels: L.featureGroup().addTo(map),
  }
  
  // Hintergrundlayer
  // das sind die layer auf der website auf der Karte, was man auswählen kann
  L.control
    .layers({
      "BasemapAT Grau": startLayer,
      "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
      "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
      "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
      "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
      "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
      "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
      "OpenTopoMap": L.tileLayer.provider("OpenTopoMap"), //hab ich dazu getan, man muss ein komma machen am Ende der Zeile
    }, {
      "Sehenswürdigkeiten": themaLayer.sights,
      "Vienna Sightseeing Linien": themaLayer.lines,
      "Vienna Sightseeing Haltestellen": themaLayer.stops,
      "Fußgängerzonen Wien": themaLayer.zones,
      "Unterkünfte Wien": themaLayer.hotels,
    })
    .addTo(map);
  
  // // Marker Stephansdom
  // L.marker([stephansdom.lat, stephansdom.lng])
  //   .addTo(themaLayer.sights)
  //   .bindPopup(stephansdom.title) //wir verwenden den Title von oben -- als Stephansdom
  //   .openPopup();
  
  // Maßstab
  L.control
    .scale({
      imperial: false,
    })
    .addTo(map);
  
  // Vollbild mit plugin Fullscreen
  L.control
    .fullscreen()
    .addTo(map);
  
  //syntax einer Funktion
  // function addiere(zahl1, zahl2) {
  //   let summe = zahl1 + zahl2;
  //   console.log("Summe: ", summe)
  // }
  // addiere(4, 7);
  
  //Sehenswürdigkeiten aus Datensatz data.gv
  async function loadSights(url) { // async weil wir brauchen das für await, für funktionen die länger dauern können
    console.log("Loading", url);
    let response = await fetch(url);
    let geojson = await response.json();
    console.log(geojson);
    L.geoJSON(geojson, {
      onEachFeature: function (feature, layer) {
        console.log(feature);
        console.log(feature.properties.NAME);
        layer.bindPopup(`
          <img src="${feature.properties.THUMBNAIL}" alt="*">
        <h4> <a href="${feature.properties.WEITERE_INF}"
        target="wien"> ${feature.properties.NAME}</a></h4>
        <address>${feature.properties.ADRESSE}</address>
        `);
      }
    }).addTo(themaLayer.sights); // wir laden das in themalayer.sights weil wir das wiederum oben schon in die map laden
    // wir laden die url down vom data.gv server und dann wandeln wir das in ein geojson um, so kann man sofort was visualisieren
  }
  loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json");
  
  async function loadlines(url) {
    console.log("Loading", url);
    let response = await fetch(url);
    let geojson = await response.json();
    console.log(geojson);
    L.geoJSON(geojson, {
      onEachFeature: function (feature, layer) {
        console.log(feature);
        console.log(feature.properties.LINE_NAME);
        layer.bindPopup(`
        <h4>${feature.properties.LINE_NAME}</h4>
        <h5>Startstation: ${feature.properties.FROM_NAME}</h5>
        <h5>Endstation: ${feature.properties.TO_NAME}</h5>
        `);
      }
    }).addTo(themaLayer.lines);
  }
  
  loadlines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")
  
  async function loadstops(url) {
    console.log("Loading", url);
    let response = await fetch(url);
    let geojson = await response.json();
    console.log(geojson);
    L.geoJSON(geojson, {
      onEachFeature: function (feature, layer) {
        console.log(feature);
        console.log(feature.properties.STAT_NAME);
        layer.bindPopup(`<h4><i class="fa-solid fa-bus"></i>${feature.properties.STAT_NAME}</h4>`);
      }
    }).addTo(themaLayer.stops);
  }
  
  loadstops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")
  
  async function loadzones(url) {
    console.log("Loading", url);
    let response = await fetch(url);
    let geojson = await response.json();
    console.log(geojson);
    L.geoJSON(geojson, {
      onEachFeature: function (feature, layer) {
        console.log(feature);
        console.log(feature.properties.NAME);
        layer.bindPopup(`<i class="fa-solid fa-person-walking"></i><h4>Fußgängerzone</h4>`);
      }
    }).addTo(themaLayer.zones);
  }
  
  loadzones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")
  
  async function loadhotels(url) {
    console.log("Loading", url);
    let response = await fetch(url);
    let geojson = await response.json();
    console.log(geojson);
    L.geoJSON(geojson, {
      onEachFeature: function (feature, layer) {
        console.log(feature);
        console.log(feature.properties.NAME);
        layer.bindPopup(`
        <h4><i class="fa-solid fa-bed"></i> <a href="${feature.properties.WEBLINK1}" target="xyz"> ${feature.properties.BETRIEB}</a></h4>
        <address>${feature.properties.ADRESSE}</address>
        `);
      }
    }).addTo(themaLayer.hotels);
  }
  
  loadhotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")