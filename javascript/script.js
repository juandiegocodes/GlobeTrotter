const travelApp = {};
travelApp.baseUrl = `https://restcountries.eu/rest/v2/all`;
travelApp.filteredArray = [];
travelApp.languagesArray = [];

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
travelApp.filter = function(rawData) {
    for(let i = 0; i <= 249; i++) {
        if (rawData[i].population > 15000000 && rawData[i].flag != "") {
            travelApp.filteredArray.push(rawData[i])
        }
    } 
}

//click function
travelApp.userClick = function() {
    $('.button').on('click', function() {
        travelApp.country= travelApp.filteredArray[travelApp.randomIndex()];
        console.log(travelApp.country);
        
        //dom rendering
        const name = travelApp.country.name
        $('.country-name').html(`${name}!`);

        const flag = travelApp.country.flag
        $('.flag').attr('src', flag).attr('alt', `${name}'s flag`);

        const capital = travelApp.country.capital
        $('.capital-name').html(`${capital}`);

        const subregion = travelApp.country.subregion
        $('.sub-region').html(`${subregion}`);

        // const population = travelApp.country.population
        const population= travelApp.numberWithCommas(travelApp.country.population);
        $('.population').html(`${population}`);

        travelApp.languagesArray = []
        travelApp.multipleLanguages();
        console.log(travelApp.languagesArray)
        $('.languages').html(travelApp.languagesArray.join(', '));
        travelApp.otherInfo = [];
    })
}

travelApp.multipleLanguages = function() {
    for(let i = 0; i<(travelApp.country.languages).length; i++) {
        travelApp.languagesArray.push(travelApp.country.languages[i].name);
    }
}

travelApp.numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//randomize function
travelApp.randomIndex = function() {
    return (Math.floor(Math.random() * travelApp.filteredArray.length));
}
//capital, flag, name, languages object, currency
travelApp.init = function () {
    travelApp.getCountries();
    travelApp.userClick();
}

$(document).ready(function () {
    travelApp.init();
})