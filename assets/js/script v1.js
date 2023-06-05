// Wait for the document to be ready
$(document).ready(function() {
    // Handle form submission
    $('#weatherForm').submit(function(event) {
        event.preventDefault();
        var cityNames = $('#cityInput').val().trim();
        getWeather(cityNames);
    });

    // Function to get weather data
    function getWeather(cityNames) {
        var apiKey = '12fea0d5512d60952bad341f162058ec'; // Replace with your OpenWeatherMap API key

        // Split city names by comma
        var cities = cityNames.split(',');

        // Loop through each city and make API call
        cities.forEach(function(city) {
            var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    displayWeather(data);
                })
                .catch(error => {
                    console.log('Error:', error);
                });
        });
    }

    // Function to display weather data
    function displayWeather(data) {
        var city = data.city.name;
        var weatherList = data.list;
        var resultsContainer = $('#weatherResults');

        var html = '<h3>' + city + '</h3>';
        html += '<table class="table">';
        html += '<thead><tr><th>Date</th><th>Temperature (°C)</th><th>Description</th></tr></thead>';
        html += '<tbody>';

        weatherList.forEach(function(weather) {
            var date = dayjs.unix(weather.dt).format('YYYY-MM-DD HH:mm:ss');
            var temperature = Math.round(weather.main.temp - 273.15); // Convert from Kelvin to Celsius
            var description = weather.weather[0].description;

            html += '<tr>';
            html += '<td>' + date + '</td>';
            html += '<td>' + temperature + '</td>';
            html += '<td>' + description + '</td>';
            html += '</tr>';
        });

        html += '</tbody></table>';

        resultsContainer.append(html);
    }
});
