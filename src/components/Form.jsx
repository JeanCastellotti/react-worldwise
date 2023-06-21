import { useEffect, useState } from 'react'

import Button from './Button'
import BackButton from './BackButton'
import Message from './Message'
import DatePicker from 'react-datepicker'
import styles from './Form.module.css'
import { useURLPosition } from '../hooks/useURLPosition'
import Spinner from './Spinner'
import { useCity } from '../context/CityContext'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'

// export function convertToEmoji(countryCode) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split('')
//     .map((char) => 127397 + char.charCodeAt())
//   return String.fromCodePoint(...codePoints)
// }

function Form() {
  const [lat, lng] = useURLPosition()
  const [cityName, setCityName] = useState(null)
  const [country, setCountry] = useState(null)
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const { createCity, isLoading: isLoadingAddCity } = useCity()

  async function handleSubmit(e) {
    e.preventDefault()

    if (!cityName || !date) return

    await createCity({
      cityName,
      country,
      date,
      notes,
      position: { lat, lng },
    })
    navigate('/app/cities')
  }

  useEffect(() => {
    if (!lat && !lng) return

    async function fetchCity() {
      try {
        setIsLoading(true)
        setError(null)
        setCountry(null)
        setCityName(null)
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        )
        const data = await res.json()

        if (!data.countryCode)
          throw new Error(
            'That does not seem to be a city. Please click somewhere else.'
          )

        setCityName(data.city || data.locality || '')
        setCountry(data.countryName)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCity()
  }, [lat, lng])

  if (isLoading) return <Spinner />

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />

  if (error) return <Message message={error} />

  if (country && cityName)
    return (
      <form
        className={`${styles.form} ${isLoadingAddCity ? styles.loading : ''}`}
        onSubmit={handleSubmit}
      >
        <div className={styles.row}>
          <label htmlFor="cityName">City name</label>
          <input
            id="cityName"
            onChange={(e) => setCityName(e.target.value)}
            value={cityName}
          />
          {/* <span className={styles.flag}>{emoji}</span> */}
        </div>

        <div className={styles.row}>
          <label htmlFor="date">When did you go to {cityName}?</label>
          {/* <input
            id="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          /> */}
          <DatePicker
            id="date"
            onChange={(date) => setDate(date)}
            selected={date}
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="notes">Notes about your trip to {cityName}</label>
          <textarea
            id="notes"
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
          />
        </div>

        <div className={styles.buttons}>
          <Button type="primary">Add</Button>
          <BackButton />
        </div>
      </form>
    )
}

export default Form
