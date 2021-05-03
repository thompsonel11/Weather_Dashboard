var searchBtnEl = document.querySelector(".searchBtn");
var currentDate =  moment().add(10, 'days').calendar();
console.log(currentDate);
var cityList = [];

$.getJSON("./assets/city.list.json", function(json) {
    console.log(json); // this will show the info it in firebug console
});


// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// key: 08ecca64f6fc6837576d8b780463552f

