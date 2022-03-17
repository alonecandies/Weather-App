// Constant
const API_KEY = "45c572009275c1a7f21902ecbf0ae7c5";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// DOM Elements for today weather
const cityElem = document.querySelector(".city");
const todayWeatherIconElem = document.querySelector(".icon");
const todayWeatherDescriptionElem = document.querySelector(".description");
const todayWeatherTempElem = document.querySelector(".temp");
const todayWeatherRealFeelElem = document.querySelector(".real-feel");
const todayWeatherHumidityElem = document.querySelector(".humidity");
const todayWeatherPressureElem = document.querySelector(".pressure");
const todayWeatherWindElem = document.querySelector(".wind");
const timeElem = document.querySelector("#time");
const dateElem = document.querySelector("#date");
const timezoneElem = document.querySelector("#timezone");
const latLonElem = document.querySelector("#lat-lon");

// DOM Element of search box
const searchValue = document.querySelector(".search-bar");

// DOM Elements for forecast weather
const todayWeatherElem = document.querySelector("#today-weather");
const weatherForecastElem = document.querySelector("#weather-forecast");

// Initialize slick carousel for display forecast weather
const slickConfig = {
  infinite: false,
  speed: 300,
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 300,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
function slickCarousel() {
  $("#weather-forecast").slick(slickConfig);
  $(".slick-prev").html('<i class="fa fa-angle-left"></i>');
  $(".slick-next").html('<i class="fa fa-angle-right"></i>');
  $(window).resize(function () {
    $(".slick-prev").html('<i class="fa fa-angle-left"></i>');
    $(".slick-next").html('<i class="fa fa-angle-right"></i>');
  });
}
function slickCarouselInit(otherDayForcast) {
  if ($("#weather-forecast").hasClass("slick-initialized")) {
    $("#weather-forecast").slick("unslick");
    weatherForecastElem.innerHTML = otherDayForcast;
    slickCarousel();
  } else {
    weatherForecastElem.innerHTML = otherDayForcast;
    slickCarousel();
  }
}

// Initialize AOS library
AOS.init({
  easing: "slide",
  once: true,
  duration: 800,
  delay: 500,
});

// Weather object include today and forecast weather
const weather = {
  // Today weather
  fetchWeather: function (city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.displayWeather(data);
        this.forecastWeather(data.coord.lat, data.coord.lon);
      });
  },
  // Forecast weather
  forecastWeather: function (lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.displayForecast(data);
      });
  },
  // Display today weather
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity, pressure, feels_like } = data.main;
    const { speed } = data.wind;
    const weatherIconSrc = `https://openweathermap.org/img/wn/${icon}.png`;
    const backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;
    cityElem.innerText = name;
    todayWeatherIconElem.src = weatherIconSrc;
    todayWeatherDescriptionElem.innerText = description;
    todayWeatherTempElem.innerText = `${temp} °C`;
    todayWeatherRealFeelElem.innerText = `RealFeel®: ${feels_like}°C`;
    todayWeatherHumidityElem.innerText = `Humidity: ${humidity}%`;
    todayWeatherPressureElem.innerText = `Pressure: ${pressure} mbar`;
    todayWeatherWindElem.innerText = `Wind speed: ${speed} km/h`;
    latLonElem.innerHTML = data.coord.lat + "N " + data.coord.lon + "E";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage = backgroundImage;
  },
  // Display forecast weather
  displayForecast: function (data) {
    let otherDayForcast = "";
    let AOSDelay = 700;
    data.daily.forEach((day, idx) => {
      if (idx == 0) {
        todayWeatherElem.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${
              day.weather[0].icon
            }@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("dddd")}</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="sun">Sunrise - ${window
                  .moment(data.current.sunrise * 1000)
                  .format("HH:mm a")}</div>
                <div class="sun">Sunset - ${window
                  .moment(data.current.sunset * 1000)
                  .format("HH:mm a")}</div>
            </div>
            
            `;
      } else {
        otherDayForcast += `
          <div data-aos="flip-left" data-aos-delay="${AOSDelay}">
            <div class="weather-forecast-item" >
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
            </div>
          </div>
        `;
        AOSDelay += 200;
      }
    });
    timezoneElem.innerText = data.timezone;
    slickCarouselInit(otherDayForcast);
  },
  // Search weather of city
  search: function () {
    this.fetchWeather(searchValue.value);
  },
};

// Get current time
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeElem.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateElem.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

// Handle search button click
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

// Handle search input enter key press
document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

// First time load
weather.fetchWeather("Hanoi");
