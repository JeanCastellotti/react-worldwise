import { useNavigate } from 'react-router-dom'
import styles from './Map.module.css'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { useEffect, useState } from 'react'
import { useCity } from '../context/CityContext'
import { useGeolocation } from '../hooks/useGeolocation'
import Button from './Button'
import { useURLPosition } from '../hooks/useURLPosition'

function Map() {
  const [position, setPosition] = useState([0, 0])
  const { cities } = useCity()
  const {
    getPosition,
    isLoading: isLoadingGeolocation,
    position: geolocation,
  } = useGeolocation()

  const [lat, lng] = useURLPosition()

  useEffect(() => {
    if (lat && lng) setPosition([lat, lng])
  }, [lat, lng])

  useEffect(() => {
    if (geolocation) setPosition([geolocation.lat, geolocation.lng])
  }, [geolocation])

  return (
    <div className={styles.mapContainer}>
      {!geolocation && (
        <Button type="position" onClick={getPosition}>
          {isLoadingGeolocation ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }) {
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick() {
  const navigate = useNavigate()
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  })
}

export default Map
