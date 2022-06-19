const input = document.getElementById("city");
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const btnsearch = document.getElementById('btn-search');
const btncompare = document.getElementById('btn-compare');

const current = document.getElementById('current-weather');
const forecast = document.getElementById('forecast-weather');

const apikey = `769117f746b254c905cc5ead9f1384d5`;

btnsearch.addEventListener("click", function(e){
    clearsection();
    getweather();
    
});

input.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        clearsection();
        getweather();
        
    }
});

btncompare.addEventListener("click", function(){
    getweather();
});

function dayoftheweek(element, data){
    new Date(element.dt*1000-(data.timezone_offset*1000)).getDay()
    return days[new Date(element.dt*1000-(data.timezone_offset*1000)).getDay()];
}

function forecastcards(element, data){

    let forecastedcity = document.getElementById(`forecastedcity-${input.value}`);

    let card = document.createElement('article');
    card.classList.add(`${input.value}`);
    card.classList.add(`card-${dayoftheweek(element, data)}`);

    let cardtitle = document.createElement('h2');
    cardtitle.classList.add('card-title');
    cardtitle.innerHTML = `${dayoftheweek(element, data)}`;

    let cardlogo = document.createElement('img');
    cardlogo.setAttribute('src', `http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`); //changer le weather [] en fonction du jour
    cardlogo.setAttribute('alt', `Weather logo`);

    let cardtemp = document.createElement('p');
    cardtemp.classList.add('card-temp');
    cardtemp.innerHTML = `${Math.round(element.temp.min)}°C - ${Math.round(element.temp.max)}°C`;

    let carddescription = document.createElement('p');
    carddescription.classList.add('card-description');
    carddescription.innerHTML = `${element.weather[0].description}`;

    forecastedcity.appendChild(card);
    card.appendChild(cardtitle);
    card.appendChild(cardlogo);
    card.appendChild(cardtemp);
    card.appendChild(carddescription);
}

function currentcardpart1(data){ // use first data
    
    let currentweather = document.createElement('article');
    currentweather.setAttribute(`id`,`currentweather-${input.value}`);
    currentweather.setAttribute(`class`,`current-weather-article`);

    let cityname = document.createElement('h2');
    cityname.innerHTML = `${data[0].name}`;

    let countryandstate = document.createElement('p');
    countryandstate.innerHTML = `${data[0].country}, ${data[0].state}`;
    
    current.appendChild(currentweather);
    currentweather.appendChild(cityname);
    currentweather.appendChild(countryandstate);
}

function currentcardpart2(data){ //use second data
    
    let currentweather = document.getElementById(`currentweather-${input.value}`);
    
    let logo = document.createElement('img');
    logo.setAttribute('src', `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`);
    logo.setAttribute('alt', `Weather logo`);

    let tempcurrent = document.createElement('p');
    tempcurrent.innerHTML = `Current temp: ${Math.round(data.current.temp)}°C`;

    let description = document.createElement('p');
    description.innerHTML = `${data.current.weather[0].description}`;
    
    currentweather.appendChild(logo);
    currentweather.appendChild(description);
    currentweather.appendChild(tempcurrent);
}

/* function clearsection(e){

    if (e.target.id === "btn-search"){
        while(current.children.length > 1) {
            current.removeChild(current.lastChild);
        }

        while(forecast.children.length > 1) {
            forecast.removeChild(forecast.lastChild);
        }
    }

    if (e.target.id === "btn-compare"){

        while(current.children.length > 1) {
            current.removeChild(current.firstChild);
        }
        while(forecast.children.length > 1) {
            forecast.removeChild(forecast.firstChild);
        }
    }
} */

function clearsection(){

    while(current.children.length > 0) {
        current.removeChild(current.lastChild);
    }

    while(forecast.children.length > 0) {
        forecast.removeChild(forecast.lastChild);
    }
}

function cityphoto(city){
    const clientid = `DcjBH9PjqFwaquQ1Ys--H9e0gFxgbvKtK6tLMJ49L9Y`;
    const photocall = `https://api.unsplash.com/search/photos?&client_id=${clientid}&query=${city}`;
    
    fetch(photocall)
    .then(function(response) {
        return response.json(); 
    })
    .then(function(data) {
        let photourl = data.results[0].urls.regular;
        console.log(photourl);
        let currentweather = document.getElementById(`currentweather-${input.value}`);

        currentweather.style.backgroundImage = `url(${photourl})`;
        currentweather.style.backgroundRepeat = `no-repeat`;
        currentweather.style.backgroundSize = `cover`;
        //current.style.backgroundPosition = `center`;
    }
    )
    .catch(function(error) {
        console.log(error);
    })
}

// MAIN FUNCTION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getweather(){

    //clearsection()

    const city = input.value;
    const geocodingcall = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;

    fetch(geocodingcall)

    .then(function(response) { 
        return response.json()
    })

    .then(function(data) {   // do stuff with `data`of the first call, call second `fetch`

        currentcardpart1(data);

        cityphoto(city);

        const lat = data[0].lat;
        const lon = data[0].lon;
        const apicall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=en&exclude=minutely,hourly,alerts&appid=${apikey}`;

        // LOG FOR CHECKING ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //console.log(data);

        return fetch(apicall)
    })

    .then(function(response) { 
        return response.json(); 
    })

    .then(function(data) { // do stuff with `data` of the second call

        currentcardpart2(data);

        let forecastedcity = document.createElement('div');
        forecastedcity.setAttribute(`id`,`forecastedcity-${input.value}`);
        forecast.appendChild(forecastedcity);
        
        for (let [index, element] of data.daily.entries()) {
            if (index > 0 && index <= 5) {
                console.log(index, element);
                forecastcards(element, data);
            }
        }

    // LOG FOR CHECKING ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*         for(const element of data.daily){
            console.log(dayoftheweek(element, data));
        }
        
        console.log(data.current.temp);
        console.log(data.daily[0].dt);
        console.log(data.timezone_offset);
        console.log(dayoftheweek(data)); */
        console.log(data);
    })

    .catch(function(error) { 
        console.log('Requestfailed', error) 
    });
};
