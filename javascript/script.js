

const artApp = {};
artApp.baseUrl = `https://restcountries.eu/rest/v2/all`;

artApp.getArt = function() {
    $.ajax({
        url: artApp.baseUrl,
        method: 'GET',
        datatype: 'json',
    }).then(function(result) {
        console.log(result);
    }) 
}

artApp.init = function () {
    artApp.getArt();
}

$(document).ready(function () {
    artApp.init();
})