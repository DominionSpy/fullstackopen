const Countries = ({ countries }) => {
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
        {countries.map(country => <div key={country.tld}>{country.name.common}</div>)}
      </>
    )
  }
  const country = countries[0]
  console.log(Object.keys(country.languages))
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.keys(country.languages).map(language =>
          <li key={language}>{country.languages[language]}</li>
        )}
      </ul>
      <img src={country.flags.png} alt='flag'/>
    </>
  )
}

export default Countries
