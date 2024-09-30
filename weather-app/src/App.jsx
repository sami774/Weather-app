import React, { useEffect, useState } from "react";

const App = () => {
  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // useEffect(() => {}, []);

  const handleClick = () => {
    const api_key =import.meta.env.VITE_WEATHER_API_KEY;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${api_key}&units=metric`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.cod === 200) {
          setData(response);
          setError("");
        } else {
          setData(null);
          setError("City not found");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="main">
        <h1>WEATHER APP</h1>
        <div className="main-box">
          <input
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            type="text"
            placeholder="Enter city name"
          />
          <button onClick={handleClick}>Search</button>

          {error && <p>{error}</p>}

          {data && (
            <>
              <p>Country: {data.sys.country}</p>
              <p>City: {data.name}</p>
              <p>Current Temperature: {data.main.temp}°C</p>
              <p>Feels like: {data.main.feels_like}°C</p>
              <p>Max Temperature: {data.main.temp_max}°C</p>
              <p>Min Temperature: {data.main.temp_min}°C</p>
              <p>Wind Speed: {data.wind.speed} m/s</p>
              <p>Humidity: {data.main.humidity}%</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
