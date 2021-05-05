var searchBtnEl = $("#searchBtn");
var currentDate = moment().add(0, "days").calendar();
console.log(currentDate);
var cityList = []; //lists the cities for autocomplete
var searchInputEl = $(".searchInput");

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

  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode},US&appid=08ecca64f6fc6837576d8b780463552f`
  ).then((response) => response.json().then(console.log));
  console.log("hi");
});

// Pseudo Code
// 1. create a list of cities for autocomplete/select
// 2. utilize the API to go get the information about the city searched
//     - today's weather and 5 day forecast
// 3. save today's weather from search to the local storage so that data can be called when user selects the button from history

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode},${countryCode}&appid=${apiKey}`

// https://openweathermap.org/api/geocoding-api

// key: 08ecca64f6fc6837576d8b780463552f
