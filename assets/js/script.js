$(document).ready(function() {

    // API key as a global variable
    var API_KEY = "12fea0d5512d60952bad341f162058ec";
  
    // Event listener for the form submission
    $("#weatherForm").submit(function(event) {
      event.preventDefault();
      var cityName = $("#cityInput").val();
      getWeather(cityName);
      saveSearchHistory(cityName);
      $("#cityInput").val(""); // Clear the input field
    });
  
    // Function to get weather data from the OpenWeatherMap API
    function getWeather(cityName) {
      var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`;
      axios
        .get(apiUrl)
        .then(function(response) {
          displayWeather(response.data);
        })
        .catch(function(error) {
          console.log("Error:", error);
        });
    }
  
    // Function to display weather data
    function displayWeather(data) {
      var weatherResults = $("#weatherResults");
      weatherResults.empty();
  
      // Display current weather conditions
      var currentWeather = data.list[0];
      var currentDate = dayjs().format('MMMM D, YYYY'); // Get the current date
      var html = `
        <div class="current-weather bordered">
        <h3 id="currentCityName">${data.city.name}</h3>
          <div id="currentWeatherInfo">
          <p><strong></strong> <span class="current-date">${currentDate}</span></p>
          </div>
          <div class="weather-info">
            <div class="weather-icon animated fadeIn">
              <i class="wi ${getWeatherIconClass(currentWeather.weather[0].icon)}"></i>
            </div>
            <div class="weather-details">
            <p><strong>Temperature:</strong> ${Math.round(currentWeather.main.temp)}°C</p>
              <p><strong>Humidity:</strong> ${currentWeather.main.humidity}%</p>
              <p><strong>Wind Speed:</strong> ${currentWeather.wind.speed} m/s</p>
              </div>
          </div>
        </div>
      `;
  
      weatherResults.append(html);
  
      // Update the current city name
      $("#currentCityName").text(data.city.name);
  
      // Display 5-day forecast
      var forecast = data.list.filter(function(item) {
        // Filter forecast data for 12:00 PM (midday) only
        return item.dt_txt.includes("12:00:00");
      });
  
      html = `
        <div class="forecast">
          <h2>5-Day Forecast</h2>
          <div class="forecast-info row">
      `;
  
      forecast.forEach(function(item, index) {
        var date = dayjs(item.dt_txt).format('MMMM D, YYYY');
        var colorClass = index % 2 === 0 ? "even-day" : "odd-day"; // Apply different color classes based on index
      
        html += `
          <div class="forecast-item ${colorClass}" style="background-color: ${getColorByIndex(index)};">
            <p class="date">${date}</p>
            <div class="weather-icon animated fadeIn">
              <i class="wi ${getWeatherIconClass(item.weather[0].icon)}"></i>
            </div>
            <p><strong>Temperature:</strong> ${Math.round(item.main.temp)}°C</p>
            <p><strong>Humidity:</strong> ${item.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${item.wind.speed} m/s</p>
          </div>
        `;
      });
      
      function getColorByIndex(index) {
        var colors = ["#2DE2EA", "#DAEC19"]; // Define your desired background colors
        return colors[index % colors.length];
      }
  
      html += `
          </div>
        </div>
      `;
  
      weatherResults.append(html);
    }
  
    // Function to get the appropriate weather icon class based on the OpenWeatherMap icon code
    function getWeatherIconClass(icon) {
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
    
      var iconClass = iconsMap[icon] || "";
      return `animated fadeIn ${iconClass}`; // Add animation classes to the icon
    }
    
  
    // Function to save search history in localStorage
    function saveSearchHistory(cityName) {
      var searchHistory = localStorage.getItem("searchHistory");
      if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
      } else {
        searchHistory = [];
      }
  
      // Add new search to the beginning of the array
      searchHistory.unshift(cityName);
  
      // Keep only the last 5 search entries
      //searchHistory = searchHistory.slice(0, 5);
  
      // Save search history back to localStorage
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  
      // Display search history
      displaySearchHistory();
    }
  
    // Function to display search history
    function displaySearchHistory() {
      var searchHistory = localStorage.getItem("searchHistory");
      if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
      } else {
        searchHistory = [];
      }
  
      var searchHistoryList = $("#searchHistory");
      searchHistoryList.empty();
  
      searchHistory.forEach(function(cityName) {
        var listItem = $("<li>").text(cityName).addClass("search-history-item");
        listItem.on("click", function() {
          getWeather(cityName);
        });
        searchHistoryList.append(listItem);
      });
    }
  
    // Display search history on page load
    displaySearchHistory();
  });
  