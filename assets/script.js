// GLOBAL VARIABLES
var searchBtnEl = $("#searchBtn");
var currentDate = moment().format("(MM/DD/YYYY)");
var cityList = []; //lists the cities for autocomplete
var searchInputEl = $(".searchInput");
var currentForecastEl = $(".currentForecast");
var recentSearches = [];

//-----------------------------------------------------------------
// Autocomplete: Functions used to add autocomplete feature utilizing local file cityList
$.getJSON("./assets/city.list.json", function (json) {
  for (let index = 0; index < json.length; index++) {
    cityList.push(`${json[index].name}, ${json[index].state}`);
  }
});

$(function () {
  $(".searchInput").autocomplete({
    source: cityList,
  });
});
//-----------------------------------------------------------------
// Click event that takes user input, pushes to resent search and runs search using the function below
searchBtnEl.click(function () {
  const userSearch = $(".searchInput").val();
  pushToRecentSearches(userSearch);
  // console.log(userSearch);
  runSearch(userSearch);
  buildRecentSearchButtons();
});

// RUN SEARCH FUNCTION BEGINS
// runSearch function first splits the user's input into City, State 
function runSearch(userSearch) {
  const userSearchSplit = userSearch.split(",");
  // console.log(userSearchSplit);
  // Define city and state as a result of the split
  const cityName = userSearchSplit[0].trim();
  const stateCode = userSearchSplit[1].trim();
  localStorage.setItem('cityNameLocal',JSON.stringify(cityName))
  // If statemenmt to require user to enter a city AND state 
  if (userSearchSplit.length < 2) {
    alert("Please enter a valid City and State");
    return;
  }
  // Define constants for API Key and for both API's: Current and 5 Day Forecast
  const apiKey = '08ecca64f6fc6837576d8b780463552f';
  const currentAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode},US&appid=${apiKey}`;
  const fiveDayAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${stateCode},US&appid=${apiKey}`;

  // Utilizing Promise to return both APIs via fetch  
  Promise.all([fetch(currentAPI), fetch(fiveDayAPI)])
    .then(function (responses) {
      return Promise.all(
        responses.map(function (response) {
          return response.json();
        })
      );
    })
    .then(function (data) {
      console.log(data);

      buildWeatherElement(data[0]);
      displayFiveDay(data[1]);
    });
}
//-----------------------------------------------------------------
//Function created for pushing recent searches by creating a search string with limit of 8
function pushToRecentSearches(searchString) {
  const searchLimit = 8;
  if(recentSearches.find(search => search === searchString)) return;
  if (recentSearches.length < searchLimit) {
    recentSearches.push(searchString);
  } else {
    const searchesWithoutOldest = recentSearches.slice(1, searchLimit);
    recentSearches = [...searchesWithoutOldest, searchString];
  }
}
// Buildimg the buttons for search history with click events that will present user with data.
function buildRecentSearchButtons() {
  const recentSearchesEl = $(".recentSearches");
  recentSearchesEl.empty();

  for (let i = 0; i < recentSearches.length; i++) {
    const btn = $(`<button type="button" class="btn btn-secondary">${recentSearches[i]}</button>`)
    btn.click(function() {
      runSearch(recentSearches[i])
    })
    recentSearchesEl.append(btn);
  }
}
//-----------------------------------------------------------------
// Function to dynamically build and display current data card 
function buildWeatherElement(data) {
  currentForecastEl.empty();
  const cardContainer = $('<div class = "card border border-primary">');
  cardContainer.append(getWeatherCard(data, data.name, "card-body"));
  currentForecastEl.append(cardContainer);
}

function getWeatherCard(weatherData, cityName, cardStyle) {
  const date = moment.unix(weatherData.dt).format("(MM/DD/YYYY)");
  const info = `${cityName} ${date}`;
  const convertedTemp = Math.floor((weatherData.main.temp - 273.15) * 1.8 + 32);
  const title = $('<h4 class = "card-title">').text(info);
  const temp = $('<p class = "card-text">').text( "Temperature: " + convertedTemp.toFixed() + " °F");
  const wind = $('<p class = "card-text">').text("Wind: " + weatherData.wind.speed + " MPH");
  const humidity = $('<p class = "card-text">').text("Humidity: " + weatherData.main.humidity + " %");
  const cardBody = $(`<div class = "${cardStyle}">`);
  const icon = $('<img class = "weatherIcon">').attr("src","https://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png");

  title.append(icon);
  cardBody.append(title, temp, wind, humidity);
  return cardBody;
}

// Function to dynamically build and display 5 day forecast data cards
function displayFiveDay(data) {
  const fiveDayForecastEl = $(".fiveDayForecast");
  fiveDayForecastEl.empty();
  fiveDayForecastEl.append("<h2>Five Day Forecast</h2>");
  const cardContainer = $('<div class = "row">');

  for (let index = 7; index < 40; index += 8) {
    cardContainer.append(
      getWeatherCard(data.list[index], data.city.name, "col-md-2 border")
    );
  }
  fiveDayForecastEl.append(cardContainer);
}
