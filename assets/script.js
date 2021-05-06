var searchBtnEl = $("#searchBtn");
var currentDate = moment().add(0, "days").calendar();
console.log(currentDate);
var cityList = []; //lists the cities for autocomplete
var searchInputEl = $(".searchInput");
var currentForecastEl = $(".currentForecast");

// Function to create the cityList
$.getJSON("./assets/city.list.json", function (json) {
  for (let index = 0; index < json.length; index++) {
    cityList.push(`${json[index].name}, ${json[index].state}`);
  }
});

// Function to autocomplete based on cityList
$(function () {
  $(".searchInput").autocomplete({
    source: cityList,
  });
});

// Function to go get data (API) for user input
searchBtnEl.click(function() {
  const userSearch = $('.searchInput').val();
  console.log(userSearch);
  const userSearchSplit = userSearch.split(",")
  console.log(userSearchSplit);

  if (userSearchSplit.length < 2) {
    alert("Please enter a valid City and State")
    return;
  }

// Define city and state as a result of the split 
  const cityName = userSearchSplit[0].trim();
  const stateCode = userSearchSplit[1].trim();
  // const countryCode = "US";
  // const apiKey = "08ecca64f6fc6837576d8b780463552f";

  var currentAPI = `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode},US&appid=08ecca64f6fc6837576d8b780463552f`

   var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${stateCode},US&appid=08ecca64f6fc6837576d8b780463552f&units=imperial`;

   Promise.all([
     fetch(currentAPI), 
     fetch(forecastUrl)
   ])
 .then(function(responses){
   return Promise.all(responses.map(function(response){
     return response.json()
   }))
 }).then(function(data){
   console.log(data)
   displayCurrentWeather(data[0])
 })
    
});

function displayCurrentWeather(data) {
  currentForecastEl.empty()

  var info = (data.name + "-" + currentDate)

  var convertedTemp = Math.floor((data.main.temp -  273.15) *1.8 +32);

  var weatherTitle = $('<h4 class = "card-title">').text(info)

  var weatherCards = $('<div class = "card border border-primary">')
  var temp = $('<p class = "card-text">').text("Temperature: "+convertedTemp.toFixed() + "F")
  var wind = $('<p class = "card-text">').text("Wind: "+ data.wind.speed + "MPH")
  var humidity = $('<p class = "card-text">').text("Humidity: "+ data.main.humidity + "%")
  var card = $('<div class = "card-body">')
  var icon = $('<img class = "weatherIcon">').attr("src","https://openweathermap.org/img/w/" + data.weather[0].icon + ".png")



// Append
weatherTitle.append(icon)
card.append(weatherTitle,temp,wind,humidity)
weatherCards.append(card)
currentForecastEl.append(weatherCards)
 }

// Pseudo Code
// 1. create a list of cities for autocomplete/select
// 2. utilize the API to go get the information about the city searched
//     - today's weather and 5 day forecast
// 3. save today's weather from search to the local storage so that data can be called when user selects the button from history

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode},${countryCode}&appid=${apiKey}`

// https://openweathermap.org/api/geocoding-api

// key: 08ecca64f6fc6837576d8b780463552f
