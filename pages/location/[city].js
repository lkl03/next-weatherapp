import React from 'react'
import Head from 'next/head'
import cities from '../../lib/city.list.json'
import TodayWeather from '../../components/TodayWeather'
import moment from 'moment'
import HourlyWeather from '../../components/HourlyWeather'
import WeeklyWeather from '../../components/WeeklyWeather'
import SearchBox from '../../components/SearchBox'


export async function getServerSideProps(context) {
    const city = getCity(context.params.city)
    if(!city) {
        return {
            notFound: true.valueOf,
        }
    }
    
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric&exclude=minutely`)
    
    const data = await res.json()
    if(!data) {
        return{
            notFound: true,
        }
    }
    return {
        props: {
            city: city,
            timezone: data.timezone,
            currentWeather: data.current,
            dailyWeather: data.daily,
            hourlyWeather: getHourlyWeather(data.hourly, data.timezone),
        }
    }
}

const getCity = param => {
    const cityParam = param.trim()
    const splitCity = cityParam.split("-")
    const id = splitCity[splitCity.length - 1]

    if(!id) {
        return null;
    }

    const city = cities.find((city) => city.id.toString() == id)
    if(city) {
        return city
    } else {
        return null
    }
}

const getHourlyWeather = (hourlyData, timezone) => {
    const endOfDay = moment().tz(timezone).endOf('day').valueOf()
    const eodTimeStamp = Math.floor(endOfDay / 1000)

    const todayData = hourlyData.filter(data => data.dt < eodTimeStamp)
    return todayData
}

const City = ({city, timezone, currentWeather, dailyWeather, hourlyWeather}) => {
    return (
    <>
        <Head>
            <title>{city.name} Weather || NWA</title>
        </Head>
        <div className="page-wrapper">
            <div className="container">
                <SearchBox placeholder="Search for another location..." />
                <TodayWeather city={city} weather={dailyWeather[0]} timezone={timezone} />
                <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} />
                <WeeklyWeather weeklyWeather={dailyWeather} timezone={timezone} />
            </div>
        </div>
    </>
  )
}

export default City