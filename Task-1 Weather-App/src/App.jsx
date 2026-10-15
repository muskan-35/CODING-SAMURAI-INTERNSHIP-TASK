
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
        throw new Error("API key is missing. Check your environment variables.");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "City not found. Please try another city."
            : data.message || "Unable to fetch weather data."
        );
      }

      setWeather(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
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
        <section className="weather-container">
          <h1 className="app-title">Weather App</h1>
          <p className="app-subtitle">Weather at a glance.</p>

          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter city name"
              aria-label="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "..." : "Search"}
            </button>
          </form>

          {loading && (
            <p className="status-message" role="status">
              Loading weather...
            </p>
          )}

          {error && !loading && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && weather?.weather?.[0] && weather?.main && (
            <section className="weather-card">
              <h2 className="city-name">
                {weather.name}
                {weather.sys?.country ? `, ${weather.sys.country}` : ""}
              </h2>

              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
              />

              <h2 className="temperature">
                {Math.round(weather.main.temp)}°C
              </h2>

              <p className="weather-description">
                {weather.weather[0].description}
              </p>

              <div className="weather-details">
                <div className="detail-row">
                  <span className="detail-icon" aria-hidden="true">🌡️</span>
                  <span className="detail-label">Feels Like</span>
                  <strong className="detail-value">
                    {Math.round(weather.main.feels_like)}°C
                  </strong>
                </div>

                <div className="detail-row">
                  <span className="detail-icon" aria-hidden="true">💧</span>
                  <span className="detail-label">Humidity</span>
                  <strong className="detail-value">
                    {weather.main.humidity}%
                  </strong>
                </div>

                <div className="detail-row">
                  <span className="detail-icon" aria-hidden="true">💨</span>
                  <span className="detail-label">Wind Speed</span>
                  <strong className="detail-value">
                    {weather.wind?.speed ?? "N/A"} m/s
                  </strong>
                </div>
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
