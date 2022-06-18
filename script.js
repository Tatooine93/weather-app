const input = document.getElementById("city");

const btnsearch = document.getElementById('btn-search');
const btncompare = document.getElementById('btn-compare');

const actual = document.getElementById('actual-weather');
const forecast = document.getElementById('forecast-weather');


const apikey = `769117f746b254c905cc5ead9f1384d5`;


//const geocodingcall = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;
//const apicall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=en&exclude=minutely,hourly,alerts&appid=${apikey}`;


btnsearch.addEventListener("click", () => {

    const city = input.value;
    const geocodingcall = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;
    
        fetch(geocodingcall)

.then(function(response) { 
    return response.json()
})

.then(function(data) {   
  // do stuff with `data`of the first call, call second `fetch`

    let actualweather = document.createElement('article');
    let cityname = document.createElement('h2');
    let countryandstate = document.createElement('p');

    actualweather.setAttribute(`id`,`actual-weather-article`);
    cityname.innerHTML = `${data[0].name}`;
    countryandstate.innerHTML = `${data[0].country}, ${data[0].state}`;

    actual.appendChild(actualweather);
    actualweather.appendChild(cityname);
    actualweather.appendChild(countryandstate);

    const lat = data[0].lat;
    const lon = data[0].lon;
    const apicall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=en&exclude=minutely,hourly,alerts&appid=${apikey}`;
    
    console.log(data);

    return fetch(apicall)
})

.then(function(response) { 
    return response.json(); 
})

.then(function(data) {
  // do stuff with `data` of the second call
    let actualweather = document.getElementById('actual-weather-article');
    let logo = document.createElement('img');
    let tempcurrent = document.createElement('p');

    
    tempcurrent.innerHTML = `Current temp: ${data.current.temp}°C`;
    logo.setAttribute('src', `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`);
    logo.setAttribute('alt', `Weather logo`);

    actualweather.appendChild(logo);
    actualweather.appendChild(tempcurrent);
    

    console.log(data);
})

.catch(function(error) { 
    console.log('Requestfailed', error) 
});

});




