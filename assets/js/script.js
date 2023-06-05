$(document).ready(function () {
    // Check if there is any search history in local storage
    var searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
        var historyList = JSON.parse(searchHistory);
        displaySearchHistory(historyList);
    }

    // Handle form submission
    $("#weatherForm").submit(function (event) {
        event.preventDefault();
        var cityName = $("#cityInput").val().trim();
        if (cityName !== "") {
            getWeatherData(cityName);
        }
        $("#cityInput").val("");
    });

    // Handle click on search history item
    $(document).on("click", ".search-history-list li", function () {
        var cityName = $(this).text();
        getWeatherData(cityName);
    });

    // Function to get weather data for a city
    function getWeatherData(cityName) {
        var apiKey = "12fea0d5512d60952bad341f162058ec"; // Replace with your OpenWeatherMap API key
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather";
        var queryParams = {
            q: cityName,
            appid: apiKey,
        };

        $.get(apiUrl, queryParams)
            .done(function (data) {
                // Display weather information
                displayWeather(data);

                // Save search history
                saveSearchHistory(cityName);
            })
            .fail(function (error) {
                console.log("Error:", error.responseJSON.message);
            });
    }

    // Function to display current weather conditions
    function displayWeather(data) {
        var city = data.name;
        var weather = data.weather[0];
        var temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
        var humidity = data.main.humidity;
        var windSpeed = data.wind.speed;

        var resultsContainer = $("#weatherResults");
        resultsContainer.empty();

        var html = "<h3>" + city + "</h3>";
        html += '<div class="weather-info">';
        html += '<div class="weather-icon"><i class="wi ' + getWeatherIconClass(weather.icon) + '"></i></div>';
        html += '<div class="weather-details">';
        html += "<p><strong>Date:</strong> " + dayjs().format("YYYY-MM-DD HH:mm:ss") + "</p>";
        html += "<p><strong>Temperature:</strong> " + temperature + "°C</p>";
        html += "<p><strong>Humidity:</strong> " + humidity + "%</p>";
        html += "<p><strong>Wind Speed:</strong> " + windSpeed + " m/s</p>";
        html += "</div>";
        html += "</div>";

        resultsContainer.html(html);
        animateWeatherIcon();
    }

    // Function to get the CSS class for the animated weather icon
    function getWeatherIconClass(icon) {
        // Map OpenWeatherMap icons to Weather Icons classes
        var iconsMap = {
          "01d": "wi-day-sunny",
          "02d": "wi-day-cloudy",
          "03d": "wi-cloudy",
          "04d": "wi-cloudy-gusts",
          "09d": "wi-showers",
          "10d": "wi-rain",
          "11d": "wi-thunderstorm",
          "13d": "wi-snow",
          "50d": "wi-fog",
          "01n": "wi-night-clear",
          "02n": "wi-night-cloudy",
          "03n": "wi-night-cloudy",
          "04n": "wi-night-cloudy-gusts",
          "09n": "wi-night-showers",
          "10n": "wi-night-rain",
          "11n": "wi-night-thunderstorm",
          "13n": "wi-night-snow",
          "50n": "wi-night-alt-cloudy-windy"
        };
      
        return iconsMap[icon] || "";
      }
    

    // Function to animate the weather icon
    function animateWeatherIcon() {
        var weatherIcon = $(".weather-icon");
        weatherIcon.addClass("fadeIn");
        weatherIcon.addClass("animate__animated animate__fadeIn");
    }

    // Function to save search history in local storage
    function saveSearchHistory(cityName) {
        var searchHistory = localStorage.getItem("searchHistory");
        var historyList = [];

        if (searchHistory) {
            historyList = JSON.parse(searchHistory);
        }

        // Remove the city from the history if it already exists
        var index = historyList.indexOf(cityName);
        if (index > -1) {
            historyList.splice(index, 1);
        }

        // Add the city to the beginning of the history list
        historyList.unshift(cityName);

        // Keep only the latest 5 search history items
        if (historyList.length > 5) {
            historyList = historyList.slice(0, 5);
        }

        // Update the search history in local storage
        localStorage.setItem("searchHistory", JSON.stringify(historyList));

        // Display the updated search history
        displaySearchHistory(historyList);
    }

    // Function to display search history
    function displaySearchHistory(historyList) {
        var historyContainer = $("#searchHistory");
        historyContainer.empty();

        $.each(historyList, function (index, city) {
            var listItem = $("<li>" + city + "</li>");
            historyContainer.append(listItem);
        });
    }
});
