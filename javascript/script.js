const travelApp = {};
travelApp.baseUrl = `https://restcountries.eu/rest/v2/all`;
travelApp.filteredArray = [];
travelApp.languagesArray = [];
travelApp.coordinates = [];

//Countries API
travelApp.getCountries = function() {
    $.ajax({
        url: travelApp.baseUrl,
        method: 'GET',
        datatype: 'json',
    }).then(function(result) {
        travelApp.filter(result);

    }).catch(error => {
        console.log(error)
      }) 
}

// travelApp.getWeather = function() {
//     $.ajax({
//         url: travelApp.baseUrl,
//         method: 'GET',
//         datatype: 'json',
//     }).then(function(result) {
//         travelApp.filter(result);

//     }).catch(error => {
//         console.log(error)
//       }) 
// }

// travelApp.getPhotos = function() {
//     $.ajax({
//         url: travelApp.baseUrl,
//         method: 'GET',
//         datatype: 'json',
//     }).then(function(result) {
//         travelApp.filter(result);

//     }).catch(error => {
//         console.log(error)
//       }) 
// }


//filter the raw data based on population, and if the returned data has a flag image
//add the data to filteredArray
travelApp.filter = function(rawData) {
    for(let i = 0; i <= 249; i++) {
        if (rawData[i].population > 15000000 && rawData[i].flag != "") {
            travelApp.filteredArray.push(rawData[i])
        }
    } 
}

//generate a random number between 0 to the length of the array
travelApp.randomIndex = function () {
    return (Math.floor(Math.random() * travelApp.filteredArray.length));
}

// name, capital, flag, languages, currencies,Demonim,region, lating(strechgoal), timezone(optional)
// each time the user click, store the selected country travelApp.country
travelApp.userClick = function() {
    $('.button').on('click', function() {
        travelApp.country = travelApp.filteredArray[travelApp.randomIndex()];
        console.log(travelApp.country);
        
        //dom rendering
        const name = travelApp.country.name
        travelApp.nameFormatting(name);
        // $('.country-name').html(`${name}!`);

        const flag = travelApp.country.flag
        $('.flag').attr('src', flag).attr('alt', `${name}'s flag`);

        const capital = travelApp.country.capital
        $('.capital-name').html(`${capital}`);

        const subregion = travelApp.country.subregion
        $('.sub-region').html(`${subregion}`);

        const population= travelApp.numberWithCommas(travelApp.country.population);
        $('.population').html(`${population}`);
        
        //each time the user click, clear the map area on the dom, and reset the coordinates array
        $('.map').html('');
        travelApp.coordinates = [];

        //then add in the new values to the coordinates array
        travelApp.coordinates.push(travelApp.country.latlng[1]);//longitude
        travelApp.coordinates.push(travelApp.country.latlng[0]);//latitude

        //render the map on the dom, 3rd party from https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js
        travelApp.map = new ol.Map({
            interactions: ol.interaction.defaults({
                doubleClickZoom: false,
                dragAndDrop: false,
                dragPan: false,
                keyboardPan: false,
                keyboardZoom: false,
                mouseWheelZoom: false,
                pointer: false,
                select: false
              }),
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })  
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([travelApp.coordinates[0],travelApp.coordinates[1]]),
                zoom: 5
            }),
          });

        //clear the previous lanugages array, and run the lanuguages function that adds a ", " to the values in the array
        travelApp.languagesArray = []
        travelApp.multipleLanguages();
        $('.languages').html(travelApp.languagesArray.join(', '));


        
    })
}

//extracting the lanuguages from each country object
travelApp.multipleLanguages = function() {
    for(let i = 0; i<(travelApp.country.languages).length; i++) {
        travelApp.languagesArray.push(travelApp.country.languages[i].name);
    }
}

//comma separate the population value
travelApp.numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//country name formatting
travelApp.nameFormatting = function (rawName) {
    let rawNameArray = rawName.split(",");
    let rawNameArray2 = rawNameArray[0].split("(");
    let countryName = rawNameArray2[0];
    $('.country-name').html(`${countryName}!`);
}

//grab the name of the selected country
//make an api call to unsplash
//pass the name as a parameter to api

//capital, flag, name, languages object, currency
travelApp.init = function () {
    travelApp.getCountries();
    travelApp.userClick();
}

$(document).ready(function () {
    travelApp.init();
})

