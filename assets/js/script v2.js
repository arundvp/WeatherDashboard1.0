// Wait for the document to be ready
$(document).ready(function() {
    // Handle form submission
    $('#weatherForm').submit(function(event) {
        event.preventDefault();
        var input = $('#cityInput').val().trim();
        getWeather(input);
    });

    // Enable autocomplete
    $('#cityInput').autocomplete({
        source: function(request, response) {
            var apiKey = '12fea0d5512d60952bad341f162058ec'; // Replace with your OpenWeatherMap API key
            var apiUrl = 'https://api.openweathermap.org/data/2.5/find?q=' + request.term + '&appid=' + apiKey;

            $.ajax({
                url: apiUrl,
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    var cities = data.list.map(function(city) {
                        return city.name;
                    });
                    response(cities);
                }
            });
        }
    });

    // Function to get weather data
    function getWeather(input) {
        var apiKey = '12fea0d5512d60952bad341f162058ec'; // Replace with your OpenWeatherMap API key

        // Check if input is a number (city code) or a string (city name)
        var apiUrl;
        if (!isNaN(input)) {
            apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?id=' + input + '&appid=' + apiKey;
        } else {
            apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + input + '&appid=' + apiKey;
        }

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
                saveSearchHistory(input);
            })
            .catch(error => {
                console.log('Error:', error);
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

        resultsContainer.html(html);
    }

    // Function to save search history to localStorage
    function saveSearchHistory(input) {
        var searchHistory = localStorage.getItem('weatherAppSearchHistory') || '[]';
        searchHistory = JSON.parse(searchHistory);
        searchHistory.push(input);
        localStorage.setItem('weatherAppSearchHistory', JSON.stringify(searchHistory));
    }

    // Function to load search history from localStorage
    function loadSearchHistory() {
        var searchHistory = localStorage.getItem('weatherAppSearchHistory');
        if (searchHistory) {
            searchHistory = JSON.parse(searchHistory);
            var historyContainer = $('#searchHistory');
            historyContainer.empty();
            searchHistory.forEach(function(item) {
                var historyItem = $('<li>').text(item);
                historyContainer.append(historyItem);
            });
        }
    }

    // Load search history on page load
    loadSearchHistory();
});
