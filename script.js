// wait for document to load
$(document).ready(function () {

    // set global variables
    // element variables
    var currentTemp = $('#temp');
    var currentHumi = $('#humi');
    var currentWind = $('#wind');
    var currentUvin = $('#uvin');
    var selectedCity = $('#selectedCity');
    var fiveDay = $('#5Day');
    var savedCitiesList = $('#savedCities');
    // array for saved info
    var cities = JSON.parse(localStorage.getItem("savedContent")) || [];
    // variable for current date
    var currentDate = new Date().toLocaleDateString('en-US');

    // functions
    // initial function to get data and display on first load
    function init() {
        // get content from local storage or a empty array if not able to
        var savedCities = JSON.parse(localStorage.getItem("savedContent")) || [];
        // populate any saved cities to the DOM
        for (var i = 0; i < savedCities.length; i++) {
            savedCitiesList.append('<button type="button" class="city btn btn-outline-secondary btn-block text-left" id="' + savedCities[i].name + '">' + savedCities[i].name + '</button>')
        }
        // ensure array is actually array and has length
        if (!Array.isArray(savedCities) || !savedCities.length) {
            // if there is nothing in the array or it is not an array we do nothing with it
        } else {
            // populate the DOM with the last searched city
            for (var j = 0; j < savedCities.length; j++) {
                if (savedCities[j].lastSearched) {
                    search(savedCities[j].name);
                }
            }

        }
    };
    // query the API and display the response to the DOM
    function search(city) {
        // set the selected city
        selectedCity.text(city);
        // unhide the 5-day forecast
        fiveDay.removeClass('d-none')
        // API key for openWeather
        var apiKey = 'e0ecd2c3ae9a8eda3c3b82e1ca5b3b9b';
        // API endpoint for 5 day forecast with city and key added
        var fiveDayQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;
        // asynchronous (other code will still run while this is running) call to API end point. this call is ran first as it can be called with a city name
        $.ajax({
            url: fiveDayQueryUrl,
            method: 'GET'
        }).then(function (response) {
            // sets latitude and longitude for the current weather API call as it does not accept a city name
            var lat = response.city.coord.lat.toString();
            var lon = response.city.coord.lon.toString();
            // API endpoint for the current weather with lat, lon, and API key added
            var currentQueryUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;
            // loop to get 5 days of weather
            for (var i = 0; i < 5; i++) {
                // array to get weather at noon for each day
                var times = [3, 11, 19, 27, 35]
                // element variables
                var dayDate = $('#day' + (i + 1) + 'Date');
                var dayIcon = $('#day' + (i + 1) + 'Icon');
                var dayTemp = $('#day' + (i + 1) + 'Temp');
                var dayHumi = $('#day' + (i + 1) + 'Humi');
                // variables to hold the response from the call and format it for easier use
                var date = response.list[times[i]].dt_txt.slice(0, -9)
                var icon = '<img class="icon" src="http://openweathermap.org/img/wn/' + response.list[times[i]].weather[0].icon + '@2x.png' + '" alt = "' + response.list[times[i]].weather[0].description + '">';
                var temp = 'Temperature: ' + Math.floor(response.list[times[i]].main.temp).toString() + '°F';
                var humi = 'Humidity: ' + response.list[times[i]].main.humidity + '%';
                // populate 5 day weather to the DOM
                dayDate.text(date);
                dayIcon.html(icon);
                dayTemp.text(temp);
                dayHumi.text(humi);
            }
            // API call for the current weather
            $.ajax({
                url: currentQueryUrl,
                method: 'GET'
            }).then(function (response) {
                // variables to hold and format the response
                var temperature = Math.floor(response.current.temp).toString();
                var humidity = response.current.humidity.toString();
                var windSpeed = Math.floor(response.current.wind_speed).toString();
                var uvIndex = response.current.uvi.toString();
                var icon = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";
                var iconAlt = response.current.weather[0].description;
                // populate responses to the DOM
                currentTemp.text('Temperature: ' + temperature + '°F');
                currentHumi.text('Humidity: ' + humidity + '%');
                currentWind.text('Wind Speed: ' + windSpeed + ' mph');
                selectedCity.html(city + ' ' + currentDate + '<img src="' + icon + '" alt = "' + iconAlt + '">');
                // properly color code the uv index based on severity
                if (uvIndex < 3) {
                    currentUvin.html('UV Index: ' + '<span class="text-success">' + uvIndex + '</span>');
                } else if (uvIndex > 2 && uvIndex < 6) {
                    currentUvin.html('UV Index: ' + '<span class="text-warning">' + uvIndex + '</span>');
                } else {
                    currentUvin.html('UV Index: ' + '<span class="text-danger">' + uvIndex + '</span>');
                }
            });
        });


    }

    // click events
    // search button click
    $('#searchBtn').on('click', function (event) {
        // get city from input box
        var city = $('#citySearchInput').val();
        // clear the input box
        $('#citySearchInput').val('')
        // compare city against array of objects to see if it was searched before
        if (cities.some(i => i.name === city)) {
            // if city is already in array update the lastSearched bool to true for the last searched city and false for all others
            for (var i = 0; i < cities.length; i++) {
                if (cities[i].name === city) {
                    cities[i].lastSearched = true;
                } else {
                    cities[i].lastSearched = false;
                }
            }
            // remove from local storage so we don't have more than one entry
            localStorage.removeItem("savedContent");
            // re save updated array to local storage
            localStorage.setItem("savedContent", JSON.stringify(cities));
            // call the search function for the city
            search(city);
        }
        // if city was not searched before
        else {
            // add button to the DOM for the searched city
            savedCitiesList.append('<button type="button" class="city btn btn-outline-secondary btn-block text-left" id="' + city + '">' + city + '</button>')
            // update lastSearched bool to false for all in the array
            for (var i = 0; i < cities.length; i++) {
                cities[i].lastSearched = false;
            };
            // add new city object to the array with a lastSearched set to true
            cities.push({
                name: city,
                lastSearched: true
            });
            // remove from local storage so we don't have more than one entry
            localStorage.removeItem("savedContent");
            // re save updated array to local storage
            localStorage.setItem("savedContent", JSON.stringify(cities));
            // call the search function for the city
            search(city);
        }
    });
    // click event for any past searched cities
    $('#savedCities').on('click', '.city', function (event) {
        // get city name from button id
        var city = $(this).attr('id');
        // update the lastSearched bool to true for the last searched city and false for all others
        for (var i = 0; i < cities.length; i++) {
            if (cities[i].name === city) {
                cities[i].lastSearched = true;
            } else {
                cities[i].lastSearched = false;
            }
        }
        // remove from local storage so we don't have more than one entry
        localStorage.removeItem("savedContent");
        // re save updated array to local storage
        localStorage.setItem("savedContent", JSON.stringify(cities));
        // call the search function for the city
        search(city);
    });







    init();











});