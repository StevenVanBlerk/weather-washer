import styles from '../styles/Home.module.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatWeatherData } from 'helpers/weatherHelpers'

export default function Home() {
  const [rawWeatherData, setWeatherData] = useState(null)
  const [isWeatherDataLoading, setIsWeatherDataLoading] = useState(true)
  useEffect(() => {
    axios
      .get(
        'https://api.open-meteo.com/v1/forecast?latitude=-33.9689192&longitude=18.4594628&hourly=precipitation&daily=precipitation_sum&timezone=Africa%2FCairo',
      )
      .then((res) => {
        setWeatherData(res.data)
        setIsWeatherDataLoading(false)
      })
  }, [])
  if (isWeatherDataLoading || !rawWeatherData) return <div>loading..</div>
  const weatherData = formatWeatherData(rawWeatherData)

  const { nearestDayOfRain = {} } = weatherData
  const { timeTillRain = '' } = nearestDayOfRain

  console.log('rawWeatherData', rawWeatherData)
  console.log('weatherData', weatherData)
  console.log('nearestDayOfRain', nearestDayOfRain)

  return (
    <div className={styles.container}>
      <div className={styles.gridItem}>
        <h1>
          {nearestDayOfRain.daysDD >= 2 || nearestDayOfRain.daysDD === null
            ? 'It is safe'
            : nearestDayOfRain.daysDD === 1
            ? 'Maybe..'
            : 'Do not do washing'}
        </h1>
      </div>
      <div className={styles.gridItem}>
        <h3>Raining in: </h3>
        <h1>{timeTillRain}</h1>
      </div>
      <pre
        style={{
          textAlign: 'left',
          padding: '10px',
          backgroundColor: 'lightgrey',
        }}
      >
        <h3>Formatted response:</h3>
        {JSON.stringify(weatherData, null, 2)}
      </pre>
    </div>
  )
}
