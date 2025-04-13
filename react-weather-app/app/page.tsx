'use client';

import { useState } from 'react';

type CitySuggestion = {
  city: string;
  country: string;
};

type WeatherData = {
  location: string;
  country: string;
  tempC: number;
  condition: string;
};

export default function Home() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  let debounceTimer: NodeJS.Timeout;

  const handleInputChange = (value: string) => {
    setCity(value);
    setWeather(null);
    clearTimeout(debounceTimer);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            value
          )}&type=city&limit=5&lang=de&apiKey=46a31de8f1e842e9847146885d632cec`
        );
        const data = await res.json();

        const results: CitySuggestion[] = data.features
          .map((f: any) => ({
            city: f.properties.city || f.properties.name,
            country: f.properties.country,
          }))
          .filter(
            (v: CitySuggestion, i: number, a: CitySuggestion[]) =>
              v.city &&
              a.findIndex(
                (x: CitySuggestion) =>
                  x.city === v.city && x.country === v.country
              ) === i
          );

        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSuggestionClick = (selected: CitySuggestion) => {
    const cityName = selected.city;
    setCity(cityName);
    setSuggestions([]);
    fetchWeather(cityName);
  };

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/weather?city=${cityName}`);
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
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🌤️ Wetter App</h1>
        <p style={styles.subheading}>Gib eine Stadt ein:</p>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={city}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="z. B. Berlin"
            style={styles.input}
          />
          {suggestions.length > 0 && (
            <ul style={styles.dropdown}>
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  style={styles.suggestion}
                >
                  {s.city}, {s.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={() => fetchWeather(city)} style={styles.button}>
          Suchen
        </button>

        {loading && <p style={styles.info}>Lade Wetterdaten...</p>}
        {error && <p style={{ ...styles.info, color: '#cc0000' }}>{error}</p>}

        {weather && (
          <div style={styles.result}>
            <p style={styles.resultLocation}>
              {weather.location}, {weather.country}
            </p>
            <p style={styles.temp}>{weather.tempC}°C</p>
            <p style={styles.resultCondition}>{weather.condition}</p>
          </div>
        )}
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: `'Segoe UI', sans-serif`,
    padding: 16,
  },
  card: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 32,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 420,
    textAlign: 'center',
    position: 'relative',
  },
  heading: {
    fontSize: 28,
    marginBottom: 8,
    color: '#222',
  },
  subheading: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 16,
    borderRadius: 10,
    border: '1px solid #ccc',
    outline: 'none',
    backgroundColor: '#f9f9f9',
    color: '#222',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fdfdfd',
    border: '1px solid #bbb',
    borderTop: 'none',
    borderRadius: '0 0 10px 10px',
    maxHeight: 200,
    overflowY: 'auto',
    zIndex: 10,
    listStyle: 'none',
    padding: 0,
    margin: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  suggestion: {
    padding: '10px 14px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff',
    color: '#222',
    transition: 'background 0.2s ease',
  },
  button: {
    padding: '10px 16px',
    fontSize: 16,
    borderRadius: 10,
    border: 'none',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
    marginTop: 4,
  },
  info: {
    marginTop: 12,
    fontSize: 14,
    color: '#333',
  },
  result: {
    marginTop: 24,
  },
  temp: {
    fontSize: 36,
    color: '#0070f3',
    margin: '8px 0',
  },
  resultLocation: {
    fontSize: 18,
    color: '#333', // Dunkler für bessere Lesbarkeit
    marginBottom: 8,
  },
  
  resultCondition: {
    fontSize: 18,
    color: '#555',
  },
  
};
