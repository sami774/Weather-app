import React, { useState, useEffect } from "react";
import "./App.css";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from 'lucide-react';

const WeatherIcon = ({ weatherMain }) => {
  const iconProps = {
    size: 64,
    color: "white",
    className: "weather-icon"
  };

  switch (weatherMain) {
    case "Clear":
      return <Sun {...iconProps} />;
    case "Clouds":
      return <Cloud {...iconProps} />;
    case "Rain":
    case "Drizzle":
      return <CloudRain {...iconProps} />;
    case "Snow":
      return <CloudSnow {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
};

const App = () => {
  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getWeatherDescription = (weatherMain) => {
    const descriptions = {
      Clear: "Clear skies",
      Clouds: "Cloudy weather",
      Rain: "Rainy weather",
      Snow: "Snowy weather",
      Drizzle: "Light rain",
      Thunderstorm: "Thunderstorm",
      Mist: "Misty conditions",
    };
    return descriptions[weatherMain] || weatherMain;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleClick = async () => {
    if (!inputCity.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const api_key = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${api_key}&units=metric`
      );
      const result = await response.json();

      if (result.cod === 200) {
        setData(result);
        setError(null);
      } else {
        setData(null);
        setError(result.message || "City not found");
      }
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main" data-weather={data?.weather[0]?.main}>
      <div className="main-box">
        <h1 className="app-title">Weather Dashboard</h1>
        
        <div className="search">
          <input
            className="input-city"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="Enter city name"
            disabled={loading}
          />
          <button 
            onClick={handleClick}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="error-container">
            <p className="error">{error}</p>
          </div>
        )}

        {data && (
          <div className="weather-info">
            <div className="weather-icon-container">
              <WeatherIcon weatherMain={data.weather[0].main} />
              <p className="weather-description">
                {getWeatherDescription(data.weather[0].main)}
              </p>
            </div>

            <div className="currtemp">
              <Thermometer className="temp-icon" />
              <p>{Math.round(data.main.temp)}°C</p>
            </div>

            <div className="place">
              <h2>{data.name}, {data.sys.country}</h2>
              <p className="coordinates">
                {data.coord.lat.toFixed(2)}°N, {data.coord.lon.toFixed(2)}°E
              </p>
            </div>

            <div className="sun-times">
              <div>
                <p className="label">Sunrise</p>
                <p>{formatTime(data.sys.sunrise)}</p>
              </div>
              <div>
                <p className="label">Sunset</p>
                <p>{formatTime(data.sys.sunset)}</p>
              </div>
            </div>

            <div className="datacontainer">
              <div className="databox">
                <Thermometer className="box-icon" />
                <div>
                  <p>Feels like</p>
                  <p>{Math.round(data.main.feels_like)}°C</p>
                </div>
              </div>

              <div className="databox">
                <Thermometer className="box-icon" />
                <div>
                  <p>Min/Max</p>
                  <p>{Math.round(data.main.temp_min)}°C / {Math.round(data.main.temp_max)}°C</p>
                </div>
              </div>

              <div className="databox">
                <Wind className="box-icon" />
                <div>
                  <p>Wind Speed</p>
                  <p>{Math.round(data.wind.speed * 3.6)} km/h</p>
                </div>
              </div>

              <div className="databox">
                <Droplets className="box-icon" />
                <div>
                  <p>Humidity</p>
                  <p>{data.main.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;