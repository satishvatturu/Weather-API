const page1 = document.querySelector('.container-1');
const page2 = document.querySelector('.container-2')
const weatherData = document.querySelector('.data');
const fetchBtn = document.querySelector('.fetch-btn');
const mapDiv = document.querySelector('.map-div');

 const apiKey = "0b42b7fd09b202659157d739b7f01067";
 const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
//  const uvUrl = "https://api.openweathermap.org/data/3.0/onecall?";


 fetchBtn.addEventListener("click", () => {
    
    if(navigator.geolocation)
    {
        if(page1.style.display !== 'none')
        {
            page1.style.display = 'none';
            page2.style.display = 'flex';
            weatherData.style.display = 'flex';
        }
        else
        {
            page2.style.display = 'none';
            page1.style.display = 'flex';
            weatherData.style.display = 'none';
        }

        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert("Geoloacation Not Supported")
    }
 })

 function showPosition(data) {
    console.log(data);
    let lat = data.coords.latitude;
    let lon = data.coords.longitude;
    document.querySelector('#lat').innerText = `Lat : ${lat}`;
    document.querySelector('#lon').innerText = `Long : ${lon}`;
    checkWeather(lat,lon);
    // checkUv(lat,lon);
 }  


//  async function checkUv(lat,lon) {
//     const response = await fetch(uvUrl + `lat=${lat}&lon=${lon}&appid=${apiKey}`);
//     var data = await response.json();

//     console.log(data);

//  }

 async function checkWeather(lat,lon) {
    const response = await fetch(apiUrl + `lat=${lat}&lon=${lon}&appid=${apiKey}`);
    var data = await response.json();

    // console.log(data);

    var offset = data.timezone;
    var timeZone = convertOffsetToTimeZone(offset);

    var pressureMillibars = data.main.pressure;
    var pressureAtmospheres = convertMillibarsToAtmospheres(pressureMillibars);

    var windDirectionDegrees = data.wind.deg;
    var windDirectionCardinal = degreesToCardinal(windDirectionDegrees);

    mapDiv.innerHTML = `
    <iframe
    src="https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed" 
    width="360" 
    height="270" 
    frameborder="0" 
    style="border:0">
    </iframe>
    `

    weatherData.innerHTML = `
    <div class="weather-data" id="location">Location : ${data.name}</div>
    <div class="weather-data" id="wind-speed">Wind speed : ${data.wind.speed}kmph</div>
    <div class="weather-data" id="humidity">Humidity : ${data.main.humidity}</div>
    <div class="weather-data" id="time-zone">Time Zone : ${timeZone}</div>
    <div class="weather-data" id="pressure">Pressure : ${pressureAtmospheres.toFixed(2)} atm</div>
    <div class="weather-data" id="wind-direc">Wind Direction : ${windDirectionCardinal}</div>
    <div class="weather-data" id="uv-index">UV Index : 500</div>
    <div class="weather-data" id="feels-like">Feels like : ${Math.round(data.main.feels_like)} °</div>
    `
    // document.querySelector('#location').innerText = `Location : ${data.name}`;
    // document.querySelector('#wind-speed').innerText = `Wind speed : ${data.wind.speed}kmph`;
    // document.querySelector('#humidity').innerText = `Humidity : ${data.main.humidity}`;
    // document.querySelector('#time-zone').innerText = `Time Zone : ${timeZone}`;
    // document.querySelector('#pressure').innerText = `Pressure : ${pressureAtmospheres.toFixed(2)} atm`;
    // document.querySelector('#feels-like').innerText = `Feels like : ${Math.round(data.main.feels_like)}°`;
    // document.querySelector('#wind-direc').innerText = `Wind Direction : ${windDirectionCardinal}`;
 }
 
function convertOffsetToTimeZone(offsetSeconds) {
    var hours = Math.floor(offsetSeconds / 3600);
    var minutes = Math.floor((offsetSeconds % 3600) / 60);
    var sign = hours >= 0 ? '+' : '-';
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var timeZoneString = 'GMT ' + sign + Math.abs(hours) + ' : ' + formattedMinutes;
    return timeZoneString;
}

function convertMillibarsToAtmospheres(pressureMb) {
    var pressureAtm = pressureMb / 1013.25;
    return pressureAtm;
}

function degreesToCardinal(degrees) {
    const directions = ["North", "North East", "East", "South East", "South", "South West", "West", "North West"];
    const index = Math.round((degrees % 360) / 45);
    return directions[index % 8];
}