import { useState, useEffect, useRef } from 'react';
import service from './service';

function requestLocation({ setPosition }) {
  const STORAGE_KEY = 'user_coords';
  const storedCoords = localStorage.getItem(STORAGE_KEY);

  if (!storedCoords) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        setPosition(coords);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
      }
    )
  } else {
    setPosition(JSON.parse(storedCoords));
  }
}

async function getForecastByCityName({ query, setForecast, setError }) {
  try {
    const forecast = await service.getForecastByCityName(query);
    setForecast(forecast);
  } catch(e) {
    setError('No city found from this query');
  }
}

async function getForecastByLatLon({ position, setForecast, setError }) {
  try {
    const forecast = await service.getForecastByLatLon({
      lat: position.latitude,
      lon: position.longitude
    });

    setForecast(forecast);
  } catch(e) {
    setError('No city found from this latitude & longitude');
  }
}

export function useWeatherApp() {
  const isInitialMount = useRef(true);
  const [position, setPosition] = useState({
    // Default location: San Francisco
    latitude: 37.7577,
    longitude: -122.4376,
  });
  const [query, setQuery] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Search by City Name
   */
  useEffect(() => {
    if(isInitialMount.current) {
      return;
    }

    setError(false);
    getForecastByCityName({ query, setForecast, setError });
  }, [query]);
  
  /**
   * Search by LatLon
   */
  useEffect(() => {
    setError(false);
    getForecastByLatLon({ position, setForecast, setError });
  }, [position]);

  useEffect(() => {
    requestLocation({setPosition});
    isInitialMount.current = false;
  }, [])

  return {
    setQuery,
    setPosition,
    state: {
      position,
      query,
      forecast,
      error
    }
  };
}