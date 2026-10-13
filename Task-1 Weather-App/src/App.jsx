// Import React Hooks
import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  // State Management
  const [city, setCity] = useState("Ghaziabad");
  const [weather, setWeather] = useState(null);

  // Fetch Default Weather
  useEffect(() => {
    fetchWeather("Ghaziabad");
  }, []);

  // Fetch Weather API
  const fetchWeather = async (cityName) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Handle Search
  const handleSearch = () => {
    if (city.trim() === "") {
      alert("Please enter a city name");
      return;
    }

    fetchWeather(city);
  };

// UI Section
return (
  <div className="weather-app">
    <Header />

    <h1 className="app-title">Weather App</h1>

    <p className="app-subtitle">
      Check the weather of your city
    </p>

    <div className="search-box">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={handleSearch}>
        Search
      </button>
    </div>

    {weather && (
      <div className="weather-card">
        <h2 className="city-name">{weather.name}</h2>

        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="Weather Icon"
        />

        <h1 className="temperature">
          {weather.main.temp}°C
        </h1>

        <p className="weather-description">
          {weather.weather[0].description}
        </p>
      </div>
    )}

  <Footer />
  </div>
  
);
}

// Export Component
export default App;