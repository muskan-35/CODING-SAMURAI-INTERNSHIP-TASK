
import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [city, setCity] = useState("Ghaziabad");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

      if (!apiKey) {
        throw new Error(
          "API key missing. Please check your environment variables."
        );
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch weather data.");
      }

      if (!data.weather?.[0] || !data.main) {
        throw new Error("Weather data is unavailable for this city.");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      console.error("Weather API error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Ghaziabad");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    fetchWeather(city.trim());
  };

  return (
    <div className="weather-app">
      <Header />

      <main className="main-content">
        <h1 className="app-title">Weather App</h1>

        <p className="app-subtitle">
          Check the weather of your city
        </p>

        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {weather?.weather?.[0] && weather?.main && (
          <div className="weather-card">
            <h2 className="city-name">{weather.name}</h2>

            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <h2 className="temperature">
              {Math.round(weather.main.temp)}°C
            </h2>

            <p className="weather-description">
              {weather.weather[0].description}
            </p>

            <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind speed: {weather.wind?.speed ?? "N/A"} m/s</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
