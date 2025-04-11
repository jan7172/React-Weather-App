export async function fetchWeather(city: string) {
    const apiKey = process.env.WEATHER_API_KEY;
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
  
    if (!res.ok) {
      throw new Error("Fehler beim Abrufen des Wetters");
    }
  
    const data = await res.json();
    return {
      location: data.location.name,
      country: data.location.country,
      tempC: data.current.temp_c,
      condition: data.current.condition.text
    };
  }
  