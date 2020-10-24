$(document).ready(function () {

    var currentTemp = $('#temp');
    var currentHumi = $('#humi');
    var currentWind = $('#wind');
    var currentUvin = $('#uvin');
    var selectedCity = $('#selectedCity');
    // var dayOneDate = $('#day'+  +'Date');
    // var dayOneIcon = $('#day1Icon');
    // var dayOneTemp = $('#day1Temp');
    // var dayOneHumi = $('#day1Humi');
    var city = 'Lehi';
    
    var date = new Date().toLocaleDateString('en-US');
    console.log(date);
    
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

        for(var i = 0; i < 5; i++){
        // day one
        var dayDate = $('#day'+ (i + 1) +'Date');
        var dayIcon = $('#day'+ (i + 1) +'Icon');
        var dayTemp = $('#day'+ (i + 1) +'Temp');
        var dayHumi = $('#day'+ (i + 1) +'Humi');
        console.log(dayDate)

        var date = response.list[i].dt_txt.slice(0,-9)
        var icon = '<img class="icon" src="http://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png' + '" alt = "' + response.list[i].weather[0].description + '">';
        var temp = 'Temperature: ' + response.list[i].main.temp + '°F';
        var humi = 'Humidity: ' + response.list[i].main.humidity + '%';
        
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
            currentUvin.text('UV Index: ' + uvIndex);
            selectedCity.html(city + ' ' + date + '<img src="' + icon + '" alt = "' + iconAlt + '">');
        });
    });


    // $.ajax({
    //     url: currentQueryUrl,
    //     method: 'GET'
    // }).then(function (response) {
    //     console.log(response);
    // });





    // <button type="button" class="btn btn-outline-secondary btn-block text-left" id="savedCity1">Lehi, Utah</button>
    // d-block


















});