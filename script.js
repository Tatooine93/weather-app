const input = document.getElementById("city");
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const btnsearch = document.getElementById('btn-search');
const btncompare = document.getElementById('btn-compare');

const current = document.getElementById('actual-weather');
const forecast = document.getElementById('forecast-weather');




btnsearch.addEventListener("click", getweather);
input.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        getweather();
    }
});

function dayoftheweek(element, data){
    new Date(element.dt*1000-(data.timezone_offset*1000)).getDay()
    return days[new Date(element.dt*1000-(data.timezone_offset*1000)).getDay()];
}

function forecastcard(element, data){
    let card = document.createElement('article');
    card.classList.add('card');

    let cardtitle = document.createElement('h2');
    cardtitle.classList.add('card-title');
    cardtitle.innerHTML = `${dayoftheweek(element, data)}`;

    let cardlogo = document.createElement('img');
    cardlogo.setAttribute('src', `http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`); //changer le weather [] en fonction du jour
    cardlogo.setAttribute('alt', `Weather logo`);

    let cardtemp = document.createElement('p');
    cardtemp.classList.add('card-text');
    cardtemp.innerHTML = `${Math.round(element.temp.min)}°C - ${Math.round(element.temp.max)}°C`;

    let carddescription = document.createElement('p');
    carddescription.classList.add('card-text');
    carddescription.innerHTML = `${element.weather[0].description}`;

    forecast.appendChild(card);
    card.appendChild(cardtitle);
    card.appendChild(cardlogo);
    card.appendChild(cardtemp);
    card.appendChild(carddescription);
}

function currentcardpart1(data){ // use first data
    
    let actualweather = document.createElement('article');
    actualweather.setAttribute(`id`,`actual-weather-article`);

    let cityname = document.createElement('h2');
    cityname.innerHTML = `${data[0].name}`;

    let countryandstate = document.createElement('p');
    countryandstate.innerHTML = `${data[0].country}, ${data[0].state}`;
    
    current.appendChild(actualweather);
    actualweather.appendChild(cityname);
    actualweather.appendChild(countryandstate);
}

function currentcardpart2(data){ //use second data
    
    let currentweather = document.getElementById('actual-weather-article');
    
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
    const photocall = `https://api.unsplash.com/search/photos?&client_id=769117f746b254c905cc5ead9f1384d5&query=${city}`;
    
    fetch(photocall)
    .then(function(response) { 
        return response.json(); 
    })
    .then(function(data) {
        let photourl = data.results[0].urls.regular;
        console.log(photourl);
        current.style.backgroundImage = `url(${photourl})`;
        current.style.backgroundRepeat = `no-repeat`;
        current.style.backgroundSize = `cover`;
        //current.style.backgroundPosition = `center`;
    }
    )
    .catch(function(error) {
        console.log(error);
    }
    )
}


// MAIN FUNCTION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getweather(){

    clearsection();

    const city = input.value;
    const geocodingcall = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=769117f746b254c905cc5ead9f1384d5`;

    cityphoto(city);

    fetch(geocodingcall)

    .then(function(response) { 
        return response.json()
    })

    .then(function(data) {   // do stuff with `data`of the first call, call second `fetch`

        currentcardpart1(data);

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

        for (let [index, element] of data.daily.entries()) {
            if (index > 0 && index <= 5) {
                console.log(index, element);
                forecastcard(element, data);
            }
        }

        
        // LOG FOR CHECKING ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*         for(const element of data.daily){
            console.log(dayoftheweek(element, data));
        }
        console.log(data);
        console.log(data.current.temp);
        console.log(data.daily[0].dt);
        console.log(data.timezone_offset);
        console.log(dayoftheweek(data)); */
    })

    .catch(function(error) { 
        console.log('Requestfailed', error) 
    });
};
