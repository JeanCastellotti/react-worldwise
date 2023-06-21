import { createContext, useContext, useEffect, useReducer } from 'react'

const CityContext = createContext()

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true }
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload }
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload }
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: null,
      }
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload }
  }
}

export function CityProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, {
    cities: [],
    isLoading: false,
    currentCity: null,
    error: null,
  })

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: 'loading' })
        const res = await fetch('http://localhost:3000/cities')
        const data = await res.json()
        dispatch({ type: 'cities/loaded', payload: data })
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading citites',
        })
      }
    }
    fetchCities()
  }, [])

  async function getCity(id) {
    if (Number(id) === currentCity?.id) return

    try {
      dispatch({ type: 'loading' })
      const res = await fetch(`http://localhost:3000/cities/${id}`)
      const data = await res.json()
      dispatch({ type: 'city/loaded', payload: data })
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error loading the city',
      })
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' })
      const res = await fetch('http://localhost:3000/cities', {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      dispatch({ type: 'city/created', payload: data })
    } catch (error) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating the city',
      })
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: 'loading' })
      await fetch(`http://localhost:3000/cities/${id}`, { method: 'DELETE' })
      dispatch({ type: 'city/deleted', payload: id })
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting the city',
      })
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const context = useContext(CityContext)
  if (!context) throw new Error('Context used outside Provider')
  return context
}
