const travelApp = {};
travelApp.baseUrl = `https://restcountries.eu/rest/v2/all`;
travelApp.weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
travelApp.weatherKey = "69114812885d0951c849bf7d699853e9";
travelApp.filteredArray = [];
travelApp.languagesArray = [];
travelApp.coordinates = [];

//Countries API
travelApp.getCountries = function() {
  $.ajax({
    url: travelApp.baseUrl,
    method: "GET",
    datatype: "json"
  })
    .then(function(result) {
      travelApp.filter(result);
    })
    .catch(function() {
      alert(
        "The world came crashing down. Zombie apocalypse is upon us. There is no safe place on earth anymore. Book yourself a flight to Mars."
      );
    });
};

//weather API - only getting the weather information of the capital city of the selected country
travelApp.getWeather = function() {
  $.ajax({
    url: travelApp.weatherUrl,
    method: "GET",
    datatype: "json",
    data: {
      APPID: travelApp.weatherKey,
      units: "metric",
      q: travelApp.country.capital
    }
  })
    .then(function(result) {
      travelApp.capitalWeather = result.main.temp;

      //render different images depending on the temperature
      $(".display-weather-header").html(
        `The weather in ${travelApp.country.capital} : `
      );
      $(".display-weather").html(`${travelApp.capitalWeather} °C `);
      if (travelApp.capitalWeather > 30) {
        $(".display-image").attr("src", "resources/travel-hero-animation.gif");
        $(".display-image").attr(
          "alt",
          "human enjoying a hot day of summer using his laptop"
        );
      } else if (travelApp.capitalWeather > 22) {
        $(".display-image").attr("src", "resources/natureselfie.gif");
        $(".display-image").attr(
          "alt",
          "human taking an outdoor selfie with his phone"
        );
      } else if (travelApp.capitalWeather > 10) {
        $(".display-image").attr(
          "src",
          "resources/adventure-camera-adjust.gif"
        );
        $(".display-image").attr(
          "alt",
          "human adjusting the position of his camera before taking a picture"
        );
      } else if (travelApp.capitalWeather > 0) {
        $(".display-image").attr("src", "resources/catch-snow.gif");
        $(".display-image").attr("alt", "human enjoying a snow day");
      } else {
        $(".display-image").attr("src", "resources/bear.gif");
        $(".display-image").attr(
          "alt",
          "polar bear and a group of humans in a snow day"
        );
      }
    })
    .catch(function() {
      //if API fails, hide the entire weather section
      $(".weather").hide();
    });
};

//filter the raw data based on population, and if the returned data has a flag image
//add the data to filteredArray
travelApp.filter = function(rawData) {
  for (let i = 0; i < rawData.length; i++) {
    if (rawData[i].population > 10000000 && rawData[i].flag != "") {
      travelApp.filteredArray.push(rawData[i]);
    }
  }
};

//generate a random number between 0 to the length of the array
travelApp.randomIndex = function() {
  return Math.floor(Math.random() * travelApp.filteredArray.length);
};

// each time the user click, store the selected country travelApp.country
travelApp.userClick = function() {
  $(".button-link").on("click", function() {
    $("section").css("display", "flex");
    $(".footer-link").css("display", "flex");
    $(".copyright").css("display", "block");
    travelApp.country = travelApp.filteredArray[travelApp.randomIndex()];

    //render the information on the DOM
    travelApp.clickRendering();

    // getting weather after the random capital has been collected
    travelApp.getWeather();

    //getting photos after the random country has been collected
    travelApp.getPhotos();
  });
};

//dom rendering
travelApp.clickRendering = function() {
  const name = travelApp.country.name;
  travelApp.nameFormatting(name);

  $(".flag")
    .attr("src", travelApp.country.flag)
    .attr("alt", `${name}'s flag`);

  $(".capital-name").html(`${travelApp.country.capital}`);

  $(".sub-region").html(`${travelApp.country.subregion}`);

  $(".demonym").html(`${travelApp.country.demonym}`);

  const currency = travelApp.country.currencies[0].name;
  $(".currency").html(`${currency}`);

  const population = travelApp.numberWithCommas(travelApp.country.population);
  $(".population").html(`${population}`);

  //each time the user click, clear the map area on the dom, and reset the coordinates array
  $(".map").html("");
  travelApp.coordinates = [];

  //then add in the new values to the coordinates array
  travelApp.coordinates.push(travelApp.country.latlng[1]); //longitude
  travelApp.coordinates.push(travelApp.country.latlng[0]); //latitude

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
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([
        travelApp.coordinates[0],
        travelApp.coordinates[1]
      ]),
      zoom: 4.5
    })
  });

  //clear the previous lanugages array, and run the lanuguages function that adds a ", " to the values in the array
  travelApp.languagesArray = [];
  travelApp.multipleLanguages();
  $(".languages").html(travelApp.languagesArray.join(", "));
};

//extracting the languages from each country object
travelApp.multipleLanguages = function() {
  for (let i = 0; i < travelApp.country.languages.length; i++) {
    travelApp.languagesArray.push(travelApp.country.languages[i].name);
  }
};

//comma separate the population value
travelApp.numberWithCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//country name formatting, remove commas and brackets in the country name
travelApp.nameFormatting = function(rawName) {
  let rawNameArray = rawName.split(",");
  let rawNameArray2 = rawNameArray[0].split("(");
  travelApp.countryName = rawNameArray2[0];
  $(".country-name").html(`${travelApp.countryName}!`);
};

// photos API
travelApp.photoUrl = "https://pixabay.com/api/";
travelApp.photoKey = "13460553-36edb17dd643bfc7f36cf9eab";
travelApp.getPhotos = function() {
  $.ajax({
    url: travelApp.photoUrl,
    method: "GET",
    datatype: "jsonp",
    data: {
      key: travelApp.photoKey,
      image_type: "photo",
      safesearch: true,
      q: travelApp.countryName,
      q: travelApp.country.capital
    }
  })
    .then(function(result) {
      travelApp.photoFilter(result);
    })
    .catch(function() {
      //if photos API fail, hide the entire gallery section
      $(".gallery-section").hide();
    });
};

//once results come back, run it through a filter
travelApp.photoFilter = function(rawPhotoObject) {
  //resetting values and DOM
  travelApp.matchingPhotosArray = [];
  $(".gallery").html("");

  //only want the "hits" array from the data we got back, rawPhotoArray is an array of objects
  const rawPhotoArray = rawPhotoObject.hits;
  let photoTags = "";

  //go through each object in the array
  for (let i = 0; i < rawPhotoArray.length; i++) {
    //grab the tag property - it's a string with comma separated values
    photoTags = rawPhotoArray[i].tags;

    //split this string into an array of words
    travelApp.photoTagsArray = photoTags.split(", ");

    //filter the array of tags for country name and demonym
    travelApp.photoTagsFilter(rawPhotoArray[i]);
  }

  travelApp.photoRendering();
};

//only want photos with tags that match the country name, demonym, and capital city
travelApp.photoTagsFilter = function(rawPhoto) {
  //go through each photo tag in the photo tags array
  for (let i = 0; i < travelApp.photoTagsArray.length; i++) {
    if (
      travelApp.photoTagsArray[i].toLowerCase() ==
        travelApp.countryName.toLowerCase() ||
      travelApp.photoTagsArray[i].toLowerCase() ==
        travelApp.country.demonym.toLowerCase() ||
      travelApp.photoTagsArray[i].toLowerCase() ==
        travelApp.country.capital.toLowerCase()
    ) {
      //add the object into matching photos array
      travelApp.matchingPhotosArray.push(rawPhoto);
    }
  }
};
//rendering matching photos on the DOM with tags as alt text
travelApp.photoRendering = function() {
  //use the set object to eliminate duplicates
  const photoSet = new Set();
  const photoAlt = [];

  //go through each object that matches, grab the jpg and tags
  for (let i = 0; i < travelApp.matchingPhotosArray.length; i++) {
    jpg = travelApp.matchingPhotosArray[i].webformatURL;
    tags = travelApp.matchingPhotosArray[i].tags;

    //if the image is not in the set, add it to the set, and push the tags in the photoAlt array
    if (photoSet.has(jpg) == false) {
      photoSet.add(jpg);
      photoAlt.push(tags);
    }
  }

  //turn the set back into an array
  const photosArray = Array.from(photoSet);

  //DOM rendering: go through the array and add the images and alt texts

  //if there're no photos left after all the filters, hide the entire section
  if (photosArray.length == 0) {
    $(".gallery-section").hide();
  } else {
    // if there're less than 3 photos, format the columns according to the amount of photos. Otherwise, use the default of 3
    if (photosArray.length < 3) {
      $(".gallery").css("column-count", photosArray.length);
    }

    for (let i = 0; i < photosArray.length; i++) {
      $(".gallery").append(`
            <div class="gallery-image">
                <img src="${photosArray[i]}" alt="${photoAlt[i]}">
            </div>
            `);
    }
  }
};

travelApp.init = function() {
  travelApp.getCountries();
  travelApp.userClick();
};

$(document).ready(function() {
  travelApp.init();
});
