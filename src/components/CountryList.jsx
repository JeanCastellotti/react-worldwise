import styles from './CountryList.module.css'
import Spinner from './Spinner'
import CountryItem from './CountryItem'
import Message from './Message'
import { useCity } from '../context/CityContext'
import { useEffect } from 'react'

function CountryList() {
  const { cities, isLoading } = useCity()

  if (isLoading) return <Spinner />

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />

  const countries = cities.reduce((acc, city) => {
    if (!acc.map((c) => c.country).includes(city.country))
      return [...acc, { country: city.country, emoji: city.emoji }]
    else return acc
  }, [])

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.country} country={country} />
      ))}
    </ul>
  )
}

export default CountryList
