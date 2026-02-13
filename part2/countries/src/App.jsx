import {useEffect, useState} from 'react'
import countryService from './services/countries'
import Countries from './components/Countries'
import Filter from './components/Filter'

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFilterChange = event => {
    setCountryFilter(event.target.value)
  }

  const countriesToShow = countryFilter === ''
    ? countries
    : countries.filter(country =>
      country.name.common.toLowerCase().includes(countryFilter.toLowerCase())
    )

  return (
    <div>
      <Filter value={countryFilter} onChange={handleFilterChange} />
      <Countries countries={countriesToShow} />
    </div>
  )
}

export default App