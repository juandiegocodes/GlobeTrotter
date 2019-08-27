const travelApp = {};
travelApp.baseUrl = `https://restcountries.eu/rest/v2/all`;

travelApp.popFilteredArray = [];
travelApp.getCountries = function() {
    $.ajax({
        url: travelApp.baseUrl,
        method: 'GET',
        datatype: 'json',
    }).then(function(result) {
        for(let i = 1; i <= 249; i++) {
            if (result[i].population > 15000000 && result[i].flag != "") {
              travelApp.popFilteredArray.push(result[i])
            }
          }
          console.log(travelApp.popFilteredArray)
        // name, capital, flag, languages, currencies,Demonim,region, lating(strechgoal), timezone(optional)
        // console.log(result);
        // console.log(result[0].name);
        // console.log(result[0].capital);
        // console.log(result[0].flag);
        // console.log(result[0].languages);
        // console.log(result[0].currencies);
    }) 
}


//capital, flag, name, languages object, currency
travelApp.init = function () {
    travelApp.getCountries();
}

$(document).ready(function () {
    travelApp.init();
})