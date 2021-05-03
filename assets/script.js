var searchBtnEl = document.querySelector(".searchBtn");
var currentDate =  moment().add(10, 'days').calendar();
console.log(currentDate);
var cityList = []; //lists the cities for autocomplete


// Function to create the cityList 
$.getJSON("./assets/city.list.json", function(json) {
    console.log(json); 
    var city = '';
    var state = ''
    for (let index = 0; index < json.length; index++) {
        cityList.push(`${json[index].name}, ${json[index].state}`)
    }
});
// Function to autocomplete based on cityList 
$( function() {
        $( ".searchInput" ).autocomplete({
      source: cityList
    });
  } );

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// key: 08ecca64f6fc6837576d8b780463552f

