import styles from './CityList.module.css'
import Spinner from './Spinner'
import CityItem from './CityItem'
import Message from './Message'
import { useCity } from '../context/CityContext'

function CityList() {
  const { cities, isLoading } = useCity()

  if (isLoading) return <Spinner />

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />

  if (cities)
    return (
      <ul className={styles.cityList}>
        {cities.map((city) => (
          <CityItem
            key={city.id}
            id={city.id}
            emoji={city.emoji}
            cityName={city.cityName}
            date={city.date}
            position={city.position}
          />
        ))}
      </ul>
    )
}

export default CityList
