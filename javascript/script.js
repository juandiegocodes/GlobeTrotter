const travelApp = {};
travelApp.baseUrl = `https://restcountries.eu/rest/v2/all`;

travelApp.getCountries = function() {
    $.ajax({
        url: travelApp.baseUrl,
        method: 'GET',
        datatype: 'json',
    }).then(function(result) {
        travelApp.filter(result);
    }) 
}

//filter the raw data based on population, and if the returned data has all the assets
// name, capital, flag, languages, currencies,Demonim,region, lating(strechgoal), timezone(optional)
travelApp.filteredArray = [];
travelApp.filter = function(rawData) {
    for(let i = 0; i <= 249; i++) {
        if (rawData[i].population > 15000000 && rawData[i].flag != "") {
            travelApp.filteredArray.push(rawData[i])
        }
    }
    console.log(travelApp.filteredArray)
    console.log(travelApp.filteredArray.length)
    travelApp.country= travelApp.filteredArray[travelApp.randomIndex()];
    console.log(travelApp.country)
    
}

//click function
// 

//randomize function
travelApp.randomIndex = function() {
    return (Math.floor(Math.random() * travelApp.filteredArray.length));
}
//capital, flag, name, languages object, currency
travelApp.init = function () {
    travelApp.getCountries();
}

$(document).ready(function () {
    travelApp.init();
})