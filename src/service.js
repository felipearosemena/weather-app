import axios from 'axios';

const api_key = process.env.REACT_APP_OPEN_WEATHER_KEY;

const getForecastByCityName = async (query = '') => axios.get(
  `http://api.openweathermap.org/data/2.5/forecast?q=${query},us&units=imperial&APPID=${api_key}`
)
.then(response => response.data);

const getForecastByLatLon = async ({lat, lon}) => axios.get(
  `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&APPID=${api_key}`
)
.then(response => response.data);

export default {
  getForecastByCityName,
  getForecastByLatLon
}
