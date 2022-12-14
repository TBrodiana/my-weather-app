
let apiKey = "b0b34e0501286ae903bab8dde901b6ae";
let cityInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");
let currentBtn = document.querySelector(".locationBtn");
let mainIcon = document.querySelector("#weatherImg");
let forecast = document.querySelector("#forecast");
let fahrenheitBtn = document.querySelector("#fahrenheitBtn");
let celsiusBtn = document.querySelector("#celsiusBtn");
let forecastArr = [];

function showCity (city){
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayNewRequest);
}

function displayNewRequest(response){
    forecast.innerHTML = "";
    forecastArr = [];
    let newRequest = new Request(response);
    newRequest.displayWeather();
    newRequest.changeIcon(mainIcon);
    getForecast(response.data.coord.lat, response.data.coord.lon);
    celsiusTemp = newRequest.temperature;
}

function handleSubmit(event){
    let city = document.querySelector("#searchInput").value;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayNewRequest);
    document.querySelector("#searchInput").value = "";
}

function showPosition(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayNewRequest);
    forecast.innerHTML = "";
}

function getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(showPosition);
    document.querySelector("#searchInput").value = "";
}

function displayFahrenheitTemp(event){
    let temperatureElement = document.querySelector(".weatherTemp");
    let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(fahrenheitTemp) + "°";
    fahrenheitBtn.classList.add("selected");
    celsiusBtn.classList.remove("selected");

    let temperatureElArr = document.querySelectorAll(".day-temp>span");

    for (let i = 0; i < temperatureElArr.length; i++){
        let celsiusValue = forecastArr[i].temp.day;
        let fahrenhaitValue = (celsiusValue * 9) / 5 + 32;
        temperatureElArr[i].innerHTML = Math.round(fahrenhaitValue);
    }
}

function displayCelsiusTemp (event){
    let temperatureElement = document.querySelector(".weatherTemp");
    temperatureElement.innerHTML = Math.round(celsiusTemp) + "°";
    fahrenheitBtn.classList.remove("selected");
    celsiusBtn.classList.add("selected");

    let temperatureElArr = document.querySelectorAll(".day-temp>span");

    for (let i = 0; i < temperatureElArr.length; i++){
        let celsiusValue = forecastArr[i].temp.day;
        temperatureElArr[i].innerHTML = Math.round(celsiusValue);
    }
}

function getForecast(latitude, longitude){
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(response => {
        let tempArr = response.data.daily;
        for (let i = 1; i < 7; i++){
            forecastArr.push(tempArr[i]);
        }
        displayForecast(forecastArr);
    });
}

function displayForecast(arr){

    arr.forEach(item => {
        let li = document.createElement("li");
        li.classList.add("week-item");

        let image = document.createElement("img");
        image.classList.add("day-img");
        let icon = findIcon(item.weather[0].id);
        image.src = `img/${icon}n.png`;

        let weekDay = document.createElement("div");
        weekDay.classList.add("day-name");
        let unixTimestamp = item.dt;
        let date = new Date(unixTimestamp * 1000);
        let dayName = date.toLocaleDateString("en-GB", {weekday: "short"});
        weekDay.innerText = dayName;

        let weekDayTemp = document.createElement("div");
        weekDayTemp.classList.add("day-temp");
        weekDayTemp.innerHTML = `<span>${Math.round(item.temp.day)}</span>°`;

        li.append(image);
        li.append(weekDay);
        li.append(weekDayTemp);
        console.log(forecast);
        forecast.append(li);
    })
}


function findIcon(value){
    let icon = "";

    switch (true){
        case (value === 800):
            icon += "01";
            break;
        case (value === 801):
            icon += "02";
            break;
        case (value === 802):
            icon = "03";
            break;
        case (value === 803 || value === 804):
            icon += "04";
            break;
        case (value > 199 && value < 300):
            icon += "11";
            break;
        case (value > 299 && value < 400):
            icon += "09";
            break;
        case (value > 499 && value < 505):
            icon += "10";
            break;
        case (value === 511):
            icon += "13";
            break;
        case (value > 519 && value < 600):
            icon += "09";
            break;
        case (value > 599 && value < 700):
            icon += "13";
            break;
        case (value > 700 && value < 800):
            icon += "50";
            break;
        default:
            icon += "01";
    }
    return icon;
}

searchBtn.addEventListener("click", handleSubmit);
cityInput.addEventListener("keydown", function (e){
    if (e.code === "Enter") handleSubmit();
})
currentBtn.addEventListener("click", getCurrentLocation);
fahrenheitBtn.addEventListener("click", displayFahrenheitTemp);
celsiusBtn.addEventListener("click", displayCelsiusTemp);


class Request {
    constructor(value) {
        this.city = value.data.name;
        this.temperature = value.data.main.temp;
        this.description = value.data.weather[0].main;
        this.humidity = value.data.main.humidity;
        this.windspeed = value.data.wind.speed;
        this.iconID = value.data.weather[0].id;
        this.lowestTemp = value.data.main.temp_min;
        this.highestTemp = value.data.main.temp_max;
        console.log(value.data);
    };

    displayWeather() {
        document.querySelector("#city").innerHTML = this.city;
        document.querySelector(".lowestTemp").innerHTML = Math.round(this.lowestTemp) + "°";
        document.querySelector(".highestTemp").innerHTML = Math.round(this.highestTemp) + "°";
        document.querySelector(".weatherTemp").innerHTML = Math.round(this.temperature) + "°";
        document.querySelector(".weather-desc").innerHTML = this.description;
        document.querySelector("#wind").innerHTML = Math.round(this.windspeed);
        document.querySelector("#humidity").innerHTML = this.humidity;
    };

    changeIcon (img){
        let icon = findIcon(this.iconID);
        let attributeValue = `img/${icon}n.png`;
        img.setAttribute("src", attributeValue);
    };
}

showCity("Kyiv");




function displayDate(value){
    let options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    }

    let optionWeekday = {
        weekday: "long"
    }

    document.querySelector("#weekday").innerHTML = value.toLocaleDateString("en-GB", optionWeekday);
    document.querySelector("#dateToday").innerHTML = value.toLocaleDateString("en-GB", options);
}

let today = new Date();

displayDate(today);