// Importing React tools and hooks
import React, { useEffect, useRef, useState } from 'react'

// Importing CSS file
import './Weather.css'

// Importing icons used in the weather app
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

// Importing SweetAlert for popup alerts
import Swal from 'sweetalert2'

// Functional component for Weather
const Weather = () => {

    // useRef is used to access the input field value
    const inputRef = useRef();

    // useState to hold the weather data after API call
    const [weatherData, setWeatherData] = useState(false);

    // Mapping weather condition codes (from API) to icons
    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": clear_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    }

    // Function to search weather by city name
    const search = async (city) => {
        // If input is empty, show alert
        if(city === "") {
            Swal.fire("Enter City Name");
            return;
        }

        try {
            // API call to OpenWeather using city and API key from env
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            // If city not found or error from API
            if(!response.ok) {
                Swal.fire(data.message);
                return;
            }

            // If success, extract icon and weather data
            const icon = allIcons[data.weather[0].icon] || clear_icon;

            // Set the weather data to state
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            })
        } catch(error) {
            // If network or API error
            setWeatherData(false);
            Swal.fire(error, "Error in fetching weather data");
        }
    }

    // useEffect runs once when component loads — shows Stockholm weather by default
    useEffect(()=> {
        search("Stockholm");
    }, [])

    // JSX return to render UI
    return (
        <div className="weather">
            {/* Search input and button */}
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder="Search" />
                <img
                    src={search_icon}
                    alt=""
                    onClick={() => search(inputRef.current.value)} // Get value and search
                />
            </div>

            {/* Weather data section — only show if weatherData exists */}
            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°c</p>
                    <p className="location">{weatherData.location}</p>

                    <div className="weather-data">
                        {/* Humidity box */}
                        <div className="col">
                            <img src={humidity_icon} alt="" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>

                        {/* Wind Speed box */}
                        <div className="col">
                            <img src={wind_icon} alt="" />
                            <div>
                                <p>{weatherData.windSpeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <></> // If no data, show nothing
            )}
        </div>
    );
}

export default Weather


// ✅ What You Did in Short:
// Created a React functional component

// Fetched weather data from OpenWeather API

// Stored data in state

// Used useRef to get input value

// Mapped weather condition codes to icons

// Showed error alerts using SweetAlert

// Displayed weather UI using conditionally rendered JSX

// Made it show Stockholm weather by default using useEffect