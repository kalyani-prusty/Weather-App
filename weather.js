// Importing necessary libraries
import React, { useState } from 'react';
import axios from 'axios';  // Axios library is used to make HTTP requests

// Weather component for fetching and displaying weather data
const Weather = () => {
  // State hooks to manage city input, weather data, and error messages
  const [city, setCity] = useState('');              // Holds the city name input by the user
  const [weatherData, setWeatherData] = useState(null); // Holds the fetched weather data
  const [error, setError] = useState(null);           // Holds error messages

  // Updates the city state when the input changes
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Asynchronous function to fetch weather data based on the city input
  const getWeatherData = async () => {
    try {
      // Reset weather data and error before making a new request
      setWeatherData(null);
      setError(null);

      // Step 1: Fetch coordinates for the city using OpenStreetMap's Nominatim API
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
      );
      
      if (geocodeResponse.data.length === 0) {
        setError("City not found. Please try a different city."); // Show error if no data is found
        return;
      }
      
      const { lat, lon } = geocodeResponse.data[0];  // Get latitude and longitude from response data

      // Step 2: Use the coordinates to fetch weather data from Open-Meteo API
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );

      setWeatherData(weatherResponse.data.current_weather); // Store the fetched weather data
    } catch (err) {
      setError("Failed to fetch weather data. Please try again later."); // Error handling
    }
  };

  // Handles search button click, only proceeds if city is not empty
  const handleSearch = () => {
    if (city.trim()) {
      getWeatherData();
    }
  };
  const handleReset = () => {
    setCity('');
    setWeatherData(null);
    setError(null);
  };
  return (
    <div className="weather-container">
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city name"  
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
         <button onClick={handleSearch}>Get Weather</button>
         <button onClick={handleReset} className="reset-button">Reset</button>
      </div>

       
       {error && <p className="error">{error}</p>}     

      {weatherData && (
        <div className="weather-info">                      
          <h2>Weather in {city}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Wind Speed: {weatherData.windspeed} km/h</p>
          <p>Wind Direction: {weatherData.winddirection}°</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
