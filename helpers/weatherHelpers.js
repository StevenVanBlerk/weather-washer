export const formatWeatherData = (rawWeatherData) => {
  const { hourly } = rawWeatherData
  const { time, precipitation } = hourly

  let dailyForecast = {}
  const nearestDayOfRain = {
    date: null,
    nearestHourOfRain: null,
    rain: null,
    timeTillRain: null,
  }

  for (let i = 0; i < time.length; i++) {
    // formatting dates
    const date = new Date(time[i])
    const currentDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`
    const currentHour = date.getHours()
    const currentRain = precipitation[i]

    if (!dailyForecast[currentDate]) {
      dailyForecast[currentDate] = {
        hourlyForecast: [{ hour: currentHour, rain: `${currentRain}mm` }],
      }
    } else {
      dailyForecast[currentDate] = {
        hourlyForecast: [
          ...dailyForecast[currentDate].hourlyForecast,
          { hour: currentHour, rain: `${currentRain}mm` },
        ],
      }
    }

    // finding soonest day of rain
    if (!nearestDayOfRain.rain && currentRain != 0) {
      const dateNow = new Date()

      const msDiff = date - dateNow
      const secondsDiff = Math.floor(msDiff / 1000)
      const minutesDiff = Math.floor(secondsDiff / 60)
      const hoursDiff = Math.floor(minutesDiff / 60)
      const daysDiff = Math.floor(hoursDiff / 24)

      const daysDD = daysDiff
      const hoursHH = hoursDiff - daysDiff * 24
      const minutesMM = minutesDiff - hoursDiff * 60

      nearestDayOfRain = {
        date: currentDate,
        nearestHourOfRain: currentHour,
        rain: currentRain,
        daysDD,
        hoursHH,
        minutesMM,
        timeTillRain: `${daysDD}d ${hoursHH}h ${minutesMM}m`,
        ...dailyForecast[currentDate],
      }
    }
  }

  return { nearestDayOfRain, dailyForecast }
}
