$(document).ready(function () {

    var currentTemp = $('#temp');
    var currentHumi = $('#humi');
    var currentWind = $('#wind');
    var currentUvin = $('#uvin');
    var selectedCity = $('#selectedCity');
    var fiveDay = $('#5Day');
    var savedCitiesList = $('#savedCities');
    var cities = JSON.parse(localStorage.getItem("savedContent")) || [];

    var currentDate = new Date().toLocaleDateString('en-US');

    init();


    function init() {
        var savedCities = JSON.parse(localStorage.getItem("savedContent")) || [];
        for (var i = 0; i < savedCities.length; i++) {
            savedCitiesList.append('<button type="button" class="city btn btn-outline-secondary btn-block text-left" id="' + savedCities[i].name + '">' + savedCities[i].name + '</button>')
        }
        if (!Array.isArray(savedCities) || !savedCities.length) {

        } else {
            for (var j = 0; j < savedCities.length; j++) {
                if (savedCities[j].lastSearched) {
                    search(savedCities[j].name);
                }
            }

        }
    }


    function search(city) {
        selectedCity.text(city);
        fiveDay.removeClass('d-none')


        var apiKey = 'e0ecd2c3ae9a8eda3c3b82e1ca5b3b9b';
        var fiveDayQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=' + apiKey;

        $.ajax({
            url: fiveDayQueryUrl,
            method: 'GET'
        }).then(function (response) {
            console.log(response);
            var lat = response.city.coord.lat.toString();
            var lon = response.city.coord.lon.toString();
            var currentQueryUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;

            for (var i = 0; i < 5; i++) {
                var times = [3, 11, 19, 27, 35]
                var dayDate = $('#day' + (i + 1) + 'Date');
                var dayIcon = $('#day' + (i + 1) + 'Icon');
                var dayTemp = $('#day' + (i + 1) + 'Temp');
                var dayHumi = $('#day' + (i + 1) + 'Humi');

                var date = response.list[times[i]].dt_txt.slice(0, -9)
                var icon = '<img class="icon" src="http://openweathermap.org/img/wn/' + response.list[times[i]].weather[0].icon + '@2x.png' + '" alt = "' + response.list[times[i]].weather[0].description + '">';
                var temp = 'Temperature: ' + Math.floor(response.list[times[i]].main.temp).toString() + '°F';
                var humi = 'Humidity: ' + response.list[times[i]].main.humidity + '%';

                dayDate.text(date);
                dayIcon.html(icon);
                dayTemp.text(temp);
                dayHumi.text(humi);
            }

            $.ajax({
                url: currentQueryUrl,
                method: 'GET'
            }).then(function (response) {
                var temperature = Math.floor(response.current.temp).toString();
                var humidity = response.current.humidity.toString();
                var windSpeed = Math.floor(response.current.wind_speed).toString();
                var uvIndex = response.current.uvi.toString();
                var icon = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";
                var iconAlt = response.current.weather[0].description;
                currentTemp.text('Temperature: ' + temperature + '°F');
                currentHumi.text('Humidity: ' + humidity + '%');
                currentWind.text('Wind Speed: ' + windSpeed + ' mph');
                selectedCity.html(city + ' ' + currentDate + '<img src="' + icon + '" alt = "' + iconAlt + '">');
                if(uvIndex < 3){
                    currentUvin.html('UV Index: ' + '<span class="text-success">' + uvIndex + '</span>');
                } else if(uvIndex > 2 && uvIndex < 6){
                    currentUvin.html('UV Index: ' + '<span class="text-warning">' + uvIndex + '</span>');
                } else {
                    currentUvin.html('UV Index: ' + '<span class="text-danger">' + uvIndex + '</span>');
                }
            });
        });


    }

    $('#searchBtn').on('click', function (event) {
        var city = $('#citySearchInput').val();
        $('#citySearchInput').val('')
        if (cities.includes(city)) {

            search(city);
        } else {
            savedCitiesList.append('<button type="button" class="city btn btn-outline-secondary btn-block text-left" id="' + city + '">' + city + '</button>')
            for (var i = 0; i < cities.length; i++) {
                cities[i].lastSearched = false;
            };
            cities.push({
                name: city,
                lastSearched: true
            });
            localStorage.removeItem("savedContent");
            localStorage.setItem("savedContent", JSON.stringify(cities));
            search(city);
        }
    });

    $('#savedCities').on('click', '.city', function (event) {
        var city = $(this).attr('id');
        console.log(cities);
        for (var i = 0; i < cities.length; i++) {
            if (cities[i].name === city) {
                cities[i].lastSearched = true;
            } else {
                cities[i].lastSearched = false;
            }
        }
        localStorage.removeItem("savedContent");
        localStorage.setItem("savedContent", JSON.stringify(cities));
        search(city);
        // search(city);
    });



















});