'use client';

import { useState } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<null | {
    location: string;
    country: string;
    tempC: number;
    condition: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/weather?city=${city}`);
      const data = await res.json();
      if (res.ok) {
        setWeather(data);
      } else {
        setError(data.error || 'Fehler beim Abrufen');
      }
    } catch {
      setError('Netzwerkfehler');
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>Wetter App 🌦️</h1>
      <input
        type="text"
        placeholder="Stadt eingeben"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={getWeather}>Suchen</button>

      {loading && <p>Lade Wetterdaten...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: 16 }}>
          <h2>{weather.location}, {weather.country}</h2>
          <p>{weather.tempC}°C, {weather.condition}</p>
        </div>
      )}
    </main>
  );
}
