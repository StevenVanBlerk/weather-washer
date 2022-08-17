export const formatWeatherData = (rawWeatherData) => {
  const { hourly } = rawWeatherData
  const { time, precipitation } = hourly

  //current time with hour rounded down
  const dateNow = new Date()
  dateNow.setMinutes(0)
  dateNow.setSeconds(0)
  dateNow.setMilliseconds(0)

  let dailyForecast = {}
  const nearestDayOfRain = {
    date: null,
    nearestHourOfRain: null,
    rain: null,
    timeTillRain: null,
  }

  for (let i = 0; i < time.length; i++) {
    const date_i = new Date(time[i])
    const dateString_i = `${date_i.getFullYear()}-${
      date_i.getMonth() + 1
    }-${date_i.getDate()}`
    const hour_i = date_i.getHours()
    const rain_i = precipitation[i]

    // skipping if date time is in the past
    if (date_i < dateNow) {
      continue
    }

    if (date_i.getDate() === dateNow.getDate())
      if (!dailyForecast[dateString_i]) {
        dailyForecast[dateString_i] = {
          hourlyForecast: [{ hour: hour_i, rain: `${rain_i}mm` }],
        }
      } else {
        dailyForecast[dateString_i] = {
          hourlyForecast: [
            ...dailyForecast[dateString_i].hourlyForecast,
            { hour: hour_i, rain: `${rain_i}mm` },
          ],
        }
      }

    // finding soonest day of rain
    if (!nearestDayOfRain.rain && rain_i != 0) {
      const msDiff = date_i - dateNow
      const secondsDiff = Math.floor(msDiff / 1000)
      const minutesDiff = Math.floor(secondsDiff / 60)
      const hoursDiff = Math.floor(minutesDiff / 60)
      const daysDiff = Math.floor(hoursDiff / 24)

      const daysDD = daysDiff
      const hoursHH = hoursDiff - daysDiff * 24
      const minutesMM = minutesDiff - hoursDiff * 60

      nearestDayOfRain = {
        date: dateString_i,
        nearestHourOfRain: hour_i,
        rain: rain_i,
        daysDD,
        hoursHH,
        minutesMM,
        timeTillRain: `${daysDD}d ${hoursHH}h ${minutesMM}m`,
        ...dailyForecast[dateString_i],
      }
    }
  }

  return { nearestDayOfRain, dailyForecast }
}
