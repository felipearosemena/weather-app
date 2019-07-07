import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import dayjs from 'dayjs';

function Chart({ data, display }) {
  const mapped = data
    .map((d) => {
      return {
        date: dayjs.unix(d.dt).format('YYYY-MM-DD HH:mm:ss'),
        [display]: d.main[display]
      }
    })

  return (
    <LineChart
      width={window.innerWidth}
      height={200}
      data={mapped}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey={display} stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
}

export default function Details({ position, forecast, error, onSetQuery, onSetPosition }) {
  const [query, setQuery] = useState('');
  const [latitude, setLatitude] = useState(position.latitude)
  const [longitude, setLongitude] = useState(position.longitude)
  const [mode, setMode] = useState('city'); // city | latlon

  useEffect(() => {
    if(forecast) {
      setQuery(forecast.city.name);
    }
  }, [forecast]);
  
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()

        if(mode === 'city') {
          onSetQuery(query);
        }

        if(mode === 'latlon') {
          onSetPosition({ latitude, longitude })
        }
      }}>
        {
          mode === 'city' && (
            <div>
              <label>City Name</label>
              <input value={query} onChange={e => setQuery(e.target.value)} />
            </div>
          )
        }

        {
          mode === 'latlon' && (
            <div>
              <label>Latitude</label>
              <input 
                value={latitude}
                name="latitude" 
                onChange={e => setLatitude(parseFloat(e.target.value || 0))}
              />

              <label>Longitude</label>
              <input 
                value={longitude}
                name="longitude"
                onChange={e => setLongitude(parseFloat(e.target.value || 0))}
              />
            </div>
          )
        }

        <label>
          Search by city
          <input
            type="radio"
            name="mode"
            value="city"
            checked={mode === 'city'}
            onChange={e => setMode(e.target.value)}
          />
        </label>

        <label>
          Search by latitude & longitude
          <input
            type="radio"
            name="mode"
            value="latlon"
            checked={mode === 'latlon'}
            onChange={e => setMode(e.target.value)}
          />
        </label>
        
        <button>Search</button>
      </form>

      {error}
      
      {forecast && (
        <div>
          <h1>{forecast.city.name}</h1>
          <Chart data={forecast.list} display="temp"/>
          <Chart data={forecast.list} display="humidity"/>
          <Chart data={forecast.list} display="pressure"/>
        </div>
      )}
    </div>
  )
}