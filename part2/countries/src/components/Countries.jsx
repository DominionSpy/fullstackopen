import { useState } from 'react'

const Countries = ({ countries, onShowCountry, weatherService }) => {
  const [weather, setWeather] = useState(null)

  if (countries.length === 0) {
    return (
      <div>No matches, specify another filter</div>
    )
  }
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  if (countries.length > 1) {
    return (
      <>
        {countries.map(country =>
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={onShowCountry} value={country.name.common}>Show</button>
          </div>)}
      </>
    )
  }
  const country = countries[0]
  weatherService
    .getCurrentWeather(country.latlng[0], country.latlng[1])
    .then(weather => {
      setWeather(weather)
    })
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.keys(country.languages).map(language =>
          <li key={language}>
            {country.languages[language]}
          </li>
        )}
      </ul>
      <img src={country.flags.png} alt='flag'/>
      <h2>Weather in {country.capital}</h2>
      { weather
        ? <>
          <div>Temperature {weather.main.temp} Celsius</div>
          <div>{weather.weather[0].main}</div>
          <div>Wind {weather.wind.speed} m/s</div>
        </>
        : ''
      }
    </>
  )
}

export default Countries
