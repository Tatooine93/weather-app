import {chart} from './modules/chart.js';

const input = document.getElementById("city");
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const btnsearch = document.getElementById('btn-search');
const btncompare = document.getElementById('btn-compare');
const btnclear = document.getElementById('btn-clear');

const search = document.getElementById('weather-btn-search');
const compare = document.getElementById('weather-btn-compare');

const apikey = `769117f746b254c905cc5ead9f1384d5`;

//LISTENER FOR SEARCH BUTTON
btnsearch.addEventListener("click", function(e){
    clearsection(e);
    getweather(e);
    
});

input.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        clearsection(e);
        getweather(e);
        
    }
});

//LISTENER FOR COMPARE BUTTON
btncompare.addEventListener("click", function(e){
    clearsection(e);
    getweather(e);
});

// LISTENER FOR CLEAR BUTTON




//FUNCTION
function dayoftheweek(element, data){
    new Date(element.dt*1000-(data.timezone_offset*1000)).getDay()
    return days[new Date(element.dt*1000-(data.timezone_offset*1000)).getDay()];
}

function creatforecastarticles (data, e) {
    let forecastedcity = document.createElement('ul');
    forecastedcity.setAttribute(`id`,`forecastedcity-${e.target.id}`);
    forecastedcity.setAttribute(`class`,`forecast-weather-article`);
    forecastedcity.classList.add(`${input.value}`);
    document.getElementById(`weather-${e.target.id}`).appendChild(forecastedcity);

    for (let [index, element] of data.daily.entries()) {
        if (index > 0 && index <= 5) {
            console.log(index, element);
            forecastcards(element, data, e);
        }
    }
}

function forecastcards(element, data, e){

    let forecastedcity = document.getElementById(`forecastedcity-${e.target.id}`);

    let card = document.createElement('li');
    card.classList.add(`${input.value}`);
    card.classList.add(`card-${dayoftheweek(element, data)}`);

    let cardtitle = document.createElement('h2');
    cardtitle.classList.add('card-title');
    cardtitle.innerHTML = `${dayoftheweek(element, data)}`;

    let cardlogo = document.createElement('img');
    cardlogo.setAttribute('src', `https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`); //changer le weather [] en fonction du jour
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

function currentcardpart1(data, e){ // use first data
    
    let currentweather = document.createElement('div');
    currentweather.setAttribute(`id`,`currentweather-${e.target.id}`);
    currentweather.setAttribute(`class`,`current-weather-article`);
    currentweather.classList.add(`${input.value}`);

    let cityname = document.createElement('h2');
    cityname.innerHTML = `${data[0].name}`;

    let countryandstate = document.createElement('p');
    countryandstate.innerHTML = `${data[0].country}, ${data[0].state}`;
    
    document.getElementById(`weather-${e.target.id}`).appendChild(currentweather);
    currentweather.appendChild(cityname);
    currentweather.appendChild(countryandstate);
}

function currentcardpart2(data,e){ //use second data
    
    let currentweather = document.getElementById(`currentweather-${e.target.id}`);
    
    let logo = document.createElement('img');
    logo.setAttribute('src', `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`);
    logo.setAttribute('alt', `Weather logo`);

    let tempcurrent = document.createElement('p');
    tempcurrent.innerHTML = `Current temp: ${Math.round(data.current.temp)}°C`;

    let description = document.createElement('p');
    description.innerHTML = `${data.current.weather[0].description}`;

    let chart = document.createElement('canvas');
    chart.setAttribute('id', `chart-${e.target.id}`);
    chart.classList.add('chart');
    chart.classList.add(`${input.value}`);

    
    currentweather.appendChild(logo);
    currentweather.appendChild(description);
    currentweather.appendChild(tempcurrent);
    currentweather.appendChild(chart);

}

function clearsection(e){
    const currentdelete = document.getElementById(`currentweather-${e.target.id}`);
    const forecastdelete = document.getElementById(`forecastedcity-${e.target.id}`);

        currentdelete?.remove();

        forecastdelete?.remove();
}

function cityphoto(city, e){
    const clientid = `DcjBH9PjqFwaquQ1Ys--H9e0gFxgbvKtK6tLMJ49L9Y`;
    const photocall = `https://api.unsplash.com/search/photos?&client_id=${clientid}&query=${city}`;

    fetch(photocall)
    .then(function(response) {
        return response.json(); 
    })
    .then(function(data) {
        console.log(data);

        let photourl = data.results[0].urls.regular;
        let currentweather = document.getElementById(`currentweather-${e.target.id}`);
        console.log(`${photourl}`);
        
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

/* function insertBefore() {
    const currentsearch = document.getElementById(`currentweather-btn-search`);
    const currentcompare = document.getElementById(`currentweather-btn-compare`);
    const forecastsearch = document.getElementById(`forecastedcity-btn-search`);
    const forecastcompare = document.getElementById(`forecastedcity-btn-compare`);

    current.insertBefore(currentsearch, currentcompare);
    forecast.insertBefore(forecastsearch, forecastcompare);
} */

/* function chart(data, e) {
    
    function gethours(element, data){
        new Date(element.dt*1000-(data.timezone_offset*1000)).getDay()
        return new Date(element.dt*1000-(data.timezone_offset*1000)).getHours();
    }

    const labels = [];
    const temp = [];

    for (let [index, element] of data.hourly.entries()) {
        if (index <= 24) {
            labels.push(gethours(element, data));
            temp.push(element.temp);
        }
    }

    const datachart = {
    labels: labels,
    datasets: [{
        label: `Temperatures/24H ${input.value}`,
        backgroundColor: 'rgb(0,121,255)',
        borderColor: 'rgb(0,121,255)',
        data: temp,
        fill: true,
        tension: 0.1,
        radius: 1,
    }]
    };

    const config = {
    type: 'line',
    data: datachart,

    options: {
        scales: {
            x: {
                display: true,
                beginAtZero: true,
            },
            
            y: {
                display: true,
                beginAtZero: true
            }
        },
    }
    };

    const chart = new Chart(
    document.getElementById(`chart-${e.target.id}`),
    config
    );

    console.log (labels);
    console.log (temp);

} */

// MAIN FUNCTION ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getweather(e){

    const city = input.value;
    const geocodingcall = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;

    fetch(geocodingcall)

    .then(function(response) { 
        return response.json()
    })

    .then(function(data) {   // do stuff with `data`of the first call, call second `fetch`

        currentcardpart1(data,e);

        cityphoto(city, e);

        const lat = data[0].lat;
        const lon = data[0].lon;
        const apicall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=en&exclude=minutely,alerts&appid=${apikey}`;

        // LOG FOR CHECKING ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //console.log(data);

        return fetch(apicall)
    })

    .then(function(response) { 
        return response.json(); 
    })

    .then(function(data) { // do stuff with `data` of the second call

        currentcardpart2(data,e);

        chart(data, e);
        
        creatforecastarticles(data,e);

        //insertBefore();
        

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
